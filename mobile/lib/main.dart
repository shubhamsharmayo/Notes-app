import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'models/note.dart';
import 'services/api_service.dart';

const bg = Color(0xFF202124), surface = Color(0xFF292A2D), red = Color(0xFFC70707);

void main() => runApp(const NotesApp());

class NotesApp extends StatelessWidget {
  const NotesApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Note Keeper', debugShowCheckedModeBanner: false,
    theme: ThemeData(brightness: Brightness.dark, scaffoldBackgroundColor: bg,
      colorScheme: ColorScheme.fromSeed(seedColor: red, brightness: Brightness.dark),
      useMaterial3: true, inputDecorationTheme: InputDecorationTheme(
        filled: true, fillColor: surface,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none))),
    home: const AuthGate());
}

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});
  @override State<AuthGate> createState() => _AuthGateState();
}
class _AuthGateState extends State<AuthGate> {
  String? user, token; bool loading = true;
  @override void initState() { super.initState(); restore(); }
  Future<void> restore() async {
    final p = await SharedPreferences.getInstance();
    if (!mounted) return;
    setState(() { user = p.getString('nameofuser'); token = p.getString('token'); loading = false; });
  }
  Future<void> signedIn(String u, String t) async {
    final p = await SharedPreferences.getInstance();
    await p.setString('nameofuser', u); await p.setString('token', t);
    if (mounted) setState(() { user = u; token = t; });
  }
  Future<void> logout() async {
    final p = await SharedPreferences.getInstance();
    await p.remove('nameofuser'); await p.remove('token');
    if (mounted) setState(() { user = null; token = null; });
  }
  @override Widget build(BuildContext context) {
    if (loading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    if (user != null && token != null) return NotesHome(username: user!, token: token!, onLogout: logout);
    return AuthScreen(onSignedIn: signedIn);
  }
}

class AuthScreen extends StatefulWidget {
  final Future<void> Function(String, String) onSignedIn;
  const AuthScreen({super.key, required this.onSignedIn});
  @override State<AuthScreen> createState() => _AuthScreenState();
}
class _AuthScreenState extends State<AuthScreen> {
  final api = ApiService(), form = GlobalKey<FormState>();
  final name = TextEditingController(), email = TextEditingController(), username = TextEditingController(), password = TextEditingController();
  bool signup = false, busy = false; String? message; bool success = false;
  @override void dispose() { name.dispose(); email.dispose(); username.dispose(); password.dispose(); super.dispose(); }
  Future<void> submit() async {
    if (!form.currentState!.validate()) return;
    setState(() { busy = true; message = null; });
    try {
      if (signup) {
        await api.signup(name: name.text.trim(), email: email.text.trim(), username: username.text.trim(), password: password.text);
        setState(() { signup = false; message = 'Account created. Please sign in.'; success = true; });
      } else {
        final result = await api.login(email.text.trim(), password.text);
        await widget.onSignedIn(result['username'].toString(), result['token'].toString());
      }
    } catch (e) { if (mounted) setState(() { message = e.toString().replaceFirst('Exception: ', ''); success = false; }); }
    finally { if (mounted) setState(() => busy = false); }
  }
  @override Widget build(BuildContext context) => Scaffold(
    body: SafeArea(child: Center(child: SingleChildScrollView(padding: const EdgeInsets.all(24),
      child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 440), child: Form(key: form,
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          const Icon(Icons.sticky_note_2_outlined, size: 64),
          const SizedBox(height: 12),
          const Text('Note Keeper', textAlign: TextAlign.center, style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
          const SizedBox(height: 30),
          Text(signup ? 'Create your account' : 'Welcome back', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w600)),
          const SizedBox(height: 18),
          if (signup) ...[TextFormField(controller: name, decoration: const InputDecoration(labelText: 'Name'), validator: (v) => v == null || v.trim().isEmpty ? 'Enter your name' : null), const SizedBox(height: 12)],
          TextFormField(controller: email, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(labelText: 'Email'), validator: (v) => v == null || !v.contains('@') ? 'Enter a valid email' : null),
          if (signup) ...[const SizedBox(height: 12), TextFormField(controller: username, decoration: const InputDecoration(labelText: 'Username'), validator: (v) => v == null || v.trim().isEmpty ? 'Enter a username' : null)],
          const SizedBox(height: 12),
          TextFormField(controller: password, obscureText: true, decoration: const InputDecoration(labelText: 'Password'), validator: (v) => v == null || v.isEmpty ? 'Enter your password' : null),
          if (message != null) ...[const SizedBox(height: 12), Text(message!, style: TextStyle(color: success ? Colors.greenAccent : Colors.redAccent))],
          const SizedBox(height: 20),
          FilledButton(style: FilledButton.styleFrom(backgroundColor: red, padding: const EdgeInsets.symmetric(vertical: 15)),
            onPressed: busy ? null : submit, child: busy ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)) : Text(signup ? 'Register' : 'Login')),
          TextButton(onPressed: busy ? null : () => setState(() { signup = !signup; message = null; }),
            child: Text(signup ? 'Already have an account? Login' : 'Create new account')),
        ]))))));

}

class NotesHome extends StatefulWidget {
  final String username, token; final Future<void> Function() onLogout;
  const NotesHome({super.key, required this.username, required this.token, required this.onLogout});
  @override State<NotesHome> createState() => _NotesHomeState();
}
class _NotesHomeState extends State<NotesHome> {
  final api = ApiService(); int tab = 0; bool loading = true;
  List<Note> notes = [], starred = []; String? error;
  @override void initState() { super.initState(); refresh(); }
  Future<void> refresh() async {
    setState(() { loading = true; error = null; });
    try {
      final values = await Future.wait([api.getNotes(widget.username, widget.token), api.getStarred(widget.username, widget.token)]);
      if (mounted) setState(() { notes = values[0]; starred = values[1]; loading = false; });
    } catch (e) { if (mounted) setState(() { error = e.toString(); loading = false; }); }
  }
  Future<void> editNote({Note? old}) async {
    final title = TextEditingController(text: old?.title ?? ''), desc = TextEditingController(text: old?.description ?? '');
    Color color = noteColor(old?.color ?? '#303030');
    final result = await showDialog<Note>(context: context, builder: (ctx) => StatefulBuilder(builder: (ctx, update) => AlertDialog(
      title: Text(old == null ? 'ADD NOTE' : 'EDIT NOTE'),
      content: SingleChildScrollView(child: Column(mainAxisSize: MainAxisSize.min, children: [
        TextField(controller: title, decoration: const InputDecoration(labelText: 'Title')),
        const SizedBox(height: 12),
        TextField(controller: desc, minLines: 4, maxLines: 8, decoration: const InputDecoration(labelText: 'Description')),
        const SizedBox(height: 14),
        Row(children: [const Text('Background'), const Spacer(), ...[
          const Color(0xFF303030), const Color(0xFF5B3434), const Color(0xFF34513D),
          const Color(0xFF354B66), const Color(0xFF66552E), const Color(0xFF59416B)]
          .map((c) => GestureDetector(onTap: () => update(() => color = c), child: Container(
            margin: const EdgeInsets.only(left: 6), width: 26, height: 26,
            decoration: BoxDecoration(color: c, shape: BoxShape.circle, border: Border.all(color: color == c ? Colors.white : Colors.transparent, width: 2)))))]),
      ])),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
        FilledButton(onPressed: () {
          if (title.text.trim().isEmpty && desc.text.trim().isEmpty) return;
          Navigator.pop(ctx, Note(id: old?.id ?? '', user: widget.username, title: title.text.trim(),
            description: desc.text.trim(), color: colorHex(color), date: old?.date ?? '', starred: old?.starred ?? false));
        }, child: const Text('Save')),
      ])));
    title.dispose(); desc.dispose();
    if (result == null) return;
    try {
      if (old == null) { final n = await api.createNote(widget.username, widget.token, result); setState(() => notes.insert(0, n)); }
      else {
        final n = await api.updateNote(old.id, widget.token, result);
        setState(() { notes = notes.map((x) => x.id == n.id ? n : x).toList(); starred = starred.map((x) => x.id == n.id ? n : x).toList(); });
      }
    } catch (e) { toast(e.toString()); }
  }
  Future<void> toggleStar(Note n) async {
    try {
      final updated = await api.setStarred(n.id, widget.token, !n.starred);
      setState(() {
        notes = notes.map((x) => x.id == updated.id ? updated : x).toList();
        starred = updated.starred ? [updated, ...starred.where((x) => x.id != updated.id)] : starred.where((x) => x.id != updated.id).toList();
      });
    } catch (e) { toast(e.toString()); }
  }
  Future<void> deleteNote(Note n) async {
    final yes = await showDialog<bool>(context: context, builder: (ctx) => AlertDialog(
      title: const Text('Delete note?'), content: const Text('This note will be permanently deleted.'),
      actions: [TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
        FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Delete'))]));
    if (yes != true) return;
    try { await api.deleteNote(n.id, widget.token); setState(() { notes.removeWhere((x) => x.id == n.id); starred.removeWhere((x) => x.id == n.id); }); }
    catch (e) { toast(e.toString()); }
  }
  void toast(String s) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(s.replaceFirst('Exception: ', ''))));
  @override Widget build(BuildContext context) {
    final items = tab == 0 ? notes : starred;
    return Scaffold(
      appBar: AppBar(title: Text(tab == 0 ? 'Note Keeper' : 'Starred'),
        actions: [Padding(padding: const EdgeInsets.only(right: 4), child: Center(child: Text('Hi ${widget.username}'))),
          IconButton(tooltip: 'Logout', onPressed: widget.onLogout, icon: const Icon(Icons.logout))]),
      body: RefreshIndicator(onRefresh: refresh, child: loading ? const Center(child: CircularProgressIndicator()) :
        error != null ? ListView(children: [const SizedBox(height: 120), Center(child: Text(error!)), Center(child: TextButton(onPressed: refresh, child: const Text('Retry')))]) :
        items.isEmpty ? ListView(children: [const SizedBox(height: 140), Icon(tab == 0 ? Icons.note_add_outlined : Icons.star_border, size: 56, color: Colors.white54),
          const SizedBox(height: 12), Center(child: Text(tab == 0 ? 'No notes yet. Tap + to create one.' : 'No starred notes yet.'))]) :
        GridView.builder(padding: const EdgeInsets.fromLTRB(14, 14, 14, 90),
          gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(maxCrossAxisExtent: 340, mainAxisExtent: 250, crossAxisSpacing: 12, mainAxisSpacing: 12),
          itemCount: items.length, itemBuilder: (ctx, i) {
            final n = items[i];
            return Card(color: noteColor(n.color), elevation: 4, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              child: Padding(padding: const EdgeInsets.all(14), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [Expanded(child: Text(n.title, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold))),
                  IconButton(onPressed: () => toggleStar(n), icon: Icon(n.starred ? Icons.star : Icons.star_border, color: Colors.amber))]),
                Expanded(child: SingleChildScrollView(child: Text(n.description))),
                const Divider(color: Colors.white24),
                Row(children: [Expanded(child: Text(n.date, style: const TextStyle(fontSize: 11, color: Colors.white70))),
                  IconButton(tooltip: 'Edit', onPressed: () => editNote(old: n), icon: const Icon(Icons.edit_outlined, size: 20)),
                  IconButton(tooltip: 'Delete', onPressed: () => deleteNote(n), icon: const Icon(Icons.delete_outline, size: 20))]),
              ])));
          })),
      floatingActionButton: tab == 0 ? FloatingActionButton(backgroundColor: red, onPressed: () => editNote(), child: const Icon(Icons.add, size: 30)) : null,
      bottomNavigationBar: NavigationBar(selectedIndex: tab, onDestinationSelected: (v) => setState(() => tab = v),
        destinations: const [NavigationDestination(icon: Icon(Icons.notes_outlined), selectedIcon: Icon(Icons.notes), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.star_border), selectedIcon: Icon(Icons.star), label: 'Starred')]),
    );
  }
}

Color noteColor(String value) {
  try { var h = value.replaceAll('#', '').replaceAll('0x', ''); if (h.length == 6) h = 'FF$h'; return Color(int.parse(h, radix: 16)); }
  catch (_) { return surface; }
}
String colorHex(Color c) => '#${c.value.toRadixString(16).substring(2).toUpperCase()}';
