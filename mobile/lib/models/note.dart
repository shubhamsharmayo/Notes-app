class Note {
  final String id, user, title, description, color, date;
  final bool starred;
  const Note({required this.id, required this.user, required this.title, required this.description, required this.color, required this.date, required this.starred});
  factory Note.fromJson(Map<String, dynamic> j) => Note(
    id: (j['_id'] ?? '').toString(), user: (j['user'] ?? '').toString(),
    title: (j['title'] ?? '').toString(), description: (j['description'] ?? '').toString(),
    color: (j['color'] ?? '#303030').toString(), date: (j['date'] ?? '').toString(),
    starred: j['starred'] == true);
  Map<String, dynamic> toJson() => {'title': title, 'description': description, 'color': color, 'user': user, 'starred': starred};
}
