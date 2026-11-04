import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/note.dart';

class ApiService {
  static const baseUrl = 'https://notes-app-inky-zeta.vercel.app';
  Map<String,String> headers({String? token}) => {'Content-Type':'application/json', if(token != null && token.isNotEmpty) 'Authorization':'Bearer $token'};
  dynamic decode(http.Response r) {
    final data = r.body.isEmpty ? null : jsonDecode(r.body);
    if(r.statusCode < 200 || r.statusCode >= 300) {
      final msg = data is Map ? (data['message'] ?? data['msg']) : data;
      throw Exception(msg?.toString() ?? 'Request failed (${r.statusCode})');
    }
    return data;
  }
  Future<Map<String,dynamic>> login(String email,String password) async {
    final r = await http.post(Uri.parse(baseUrl),headers:headers(),body:jsonEncode({'email':email,'password':password}));
    final d = decode(r);
    if(d is! Map<String,dynamic> || d['token'] == null) throw Exception('Invalid email or password');
    return d;
  }
  Future<void> signup({required String name,required String email,required String username,required String password}) async {
    final r = await http.post(Uri.parse('$baseUrl/signup'),headers:headers(),body:jsonEncode({'name':name,'email':email,'username':username,'password':password}));
    final d = decode(r);
    if(d.toString() != 'done') throw Exception(d.toString().replaceAll('"',''));
  }
  Future<List<Note>> getNotes(String user,String token) async {
    final r = await http.get(Uri.parse('$baseUrl/profile/${Uri.encodeComponent(user)}'),headers:headers(token:token));
    return (decode(r) as List).map((e)=>Note.fromJson(e)).toList();
  }
  Future<List<Note>> getStarred(String user,String token) async {
    final r = await http.get(Uri.parse('$baseUrl/profile/starred/${Uri.encodeComponent(user)}'),headers:headers(token:token));
    return (decode(r) as List).map((e)=>Note.fromJson(e)).toList();
  }
  // Matches the existing backend: note creation currently has no JWT middleware.
  Future<Note> createNote(String user,String token,Note n) async {
    final r = await http.post(Uri.parse('$baseUrl/profile/profile/${Uri.encodeComponent(user)}'),headers:headers(),body:jsonEncode(n.toJson()));
    return Note.fromJson(decode(r));
  }
  Future<Note> updateNote(String id,String token,Note n) async {
    final r = await http.put(Uri.parse('$baseUrl/profile/update/$id'),headers:headers(token:token),body:jsonEncode({'title':n.title,'description':n.description,'color':n.color}));
    return Note.fromJson(decode(r));
  }
  Future<void> deleteNote(String id,String token) async {
    final r = await http.delete(Uri.parse('$baseUrl/profile/delete/$id'),headers:headers(token:token)); decode(r);
  }
  Future<Note> setStarred(String id,String token,bool value) async {
    final route = value ? 'star' : 'unstar';
    final r = await http.put(Uri.parse('$baseUrl/profile/$route/$id'),headers:headers(token:token),body:jsonEncode({'starred':value}));
    return Note.fromJson(decode(r));
  }
}
