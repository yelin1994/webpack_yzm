// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MyColumn _$MyColumnFromJson(Map<String, dynamic> json) {
  return MyColumn(
    name: json['name'] as String,
    id: json['id'] as int,
    icon: json['icon'] as String,
    location: json['location'] as int,
    showType: json['show_type'] as int,
    description: json['description'] as String,
    subscriberNum: json['subscriber_num'] as int,
  )
    ..image = json['image'] as String
    ..contentProvider = json['content_provider'] as String;
}

Map<String, dynamic> _$MyColumnToJson(MyColumn instance) => <String, dynamic>{
      'name': instance.name,
      'id': instance.id,
      'icon': instance.icon,
      'image': instance.image,
      'description': instance.description,
      'subscriber_num': instance.subscriberNum,
      'content_provider': instance.contentProvider,
      'location': instance.location,
      'show_type': instance.showType,
    };

Category _$CategoryFromJson(Map<String, dynamic> json) {
  return Category(
    title: json['title'] as String,
    id: json['id'] as int,
    imageLab: json['image_lab'] as String,
  );
}

Map<String, dynamic> _$CategoryToJson(Category instance) => <String, dynamic>{
      'title': instance.title,
      'id': instance.id,
      'image_lab': instance.imageLab,
    };

Post _$PostFromJson(Map<String, dynamic> json) {
  return Post(
    id: json['id'] as int,
    genre: json['genre'] as int,
    title: json['title'] as String,
    description: json['description'] as String,
    publishTime: json['publish_time'] as int,
    image: json['image'] as String,
    startTime: json['start_time'] as int,
    commentCount: json['comment_count'] as int,
    commentStatus: json['comment_status'] as bool,
    praiseCount: json['praise_count'] as int,
    superTag: json['super_tag'] as String,
    pageStyle: json['page_style'] as int,
    postId: json['post_id'] as int,
    appview: json['appview'] as String,
    fileLength: json['file_length'] as String,
    dataType: json['dataType'] as String,
    category: json['category'] == null
        ? null
        : Category.fromJson(json['category'] as Map<String, dynamic>),
    column: json['column'] == null
        ? null
        : MyColumn.fromJson(json['column'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$PostToJson(Post instance) => <String, dynamic>{
      'id': instance.id,
      'genre': instance.genre,
      'category': instance.category,
      'column': instance.column,
      'title': instance.title,
      'description': instance.description,
      'publish_time': instance.publishTime,
      'image': instance.image,
      'start_time': instance.startTime,
      'comment_count': instance.commentCount,
      'comment_status': instance.commentStatus,
      'praise_count': instance.praiseCount,
      'super_tag': instance.superTag,
      'page_style': instance.pageStyle,
      'post_id': instance.postId,
      'appview': instance.appview,
      'file_length': instance.fileLength,
      'dataType': instance.dataType,
    };

MyBanner _$MyBannerFromJson(Map<String, dynamic> json) {
  return MyBanner(
    type: json['type'] as int,
    image: json['image'] as String,
    post: json['post'] == null
        ? null
        : Post.fromJson(json['post'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$MyBannerToJson(MyBanner instance) => <String, dynamic>{
      'type': instance.type,
      'image': instance.image,
      'post': instance.post,
    };

Meta _$MetaFromJson(Map<String, dynamic> json) {
  return Meta(
    status: json['status'] as int,
    msg: json['msg'] as String,
  );
}

Map<String, dynamic> _$MetaToJson(Meta instance) => <String, dynamic>{
      'status': instance.status,
      'msg': instance.msg,
    };

Article _$ArticleFromJson(Map<String, dynamic> json) {
  return Article(
    id: json['id'] as int,
    body: json['body'] as String,
    js: (json['js'] as List)?.map((e) => e as String)?.toList(),
    css: (json['css'] as List)?.map((e) => e as String)?.toList(),
    image: (json['image'] as List)?.map((e) => e as String)?.toList(),
  );
}

Map<String, dynamic> _$ArticleToJson(Article instance) => <String, dynamic>{
      'id': instance.id,
      'body': instance.body,
      'js': instance.js,
      'css': instance.css,
      'image': instance.image,
    };

News _$NewsFromJson(Map<String, dynamic> json) {
  return News(
    description: json['description'] as String,
  );
}

Map<String, dynamic> _$NewsToJson(News instance) => <String, dynamic>{
      'description': instance.description,
    };

Feed _$FeedFromJson(Map<String, dynamic> json) {
  return Feed(
    image: json['image'] as String,
    type: json['type'] as int,
    post: json['post'] == null
        ? null
        : Post.fromJson(json['post'] as Map<String, dynamic>),
    indexType: json['index_type'] as int,
    newsList: (json['news_list'] as List)
        ?.map(
            (e) => e == null ? null : News.fromJson(e as Map<String, dynamic>))
        ?.toList(),
  );
}

Map<String, dynamic> _$FeedToJson(Feed instance) => <String, dynamic>{
      'image': instance.image,
      'type': instance.type,
      'index_type': instance.indexType,
      'post': instance.post,
      'news_list': instance.newsList,
    };

Author _$AuthorFromJson(Map<String, dynamic> json) {
  return Author(
    id: json['id'] as int,
    description: json['description'] as String,
    avatar: json['avatar'] as String,
    name: json['name'] as String,
  );
}

Map<String, dynamic> _$AuthorToJson(Author instance) => <String, dynamic>{
      'id': instance.id,
      'description': instance.description,
      'avatar': instance.avatar,
      'name': instance.name,
    };

MyResponse _$MyResponseFromJson(Map<String, dynamic> json) {
  return MyResponse(
    column: json['column'] == null
        ? null
        : MyColumn.fromJson(json['column'] as Map<String, dynamic>),
    hasMore: json['has_more'] as bool,
    lastKey: json['last_key'],
    article: json['article'] == null
        ? null
        : Article.fromJson(json['article'] as Map<String, dynamic>),
    feeds: (json['feeds'] as List)
        ?.map(
            (e) => e == null ? null : Feed.fromJson(e as Map<String, dynamic>))
        ?.toList(),
    authors: (json['authors'] as List)
        ?.map((e) =>
            e == null ? null : Author.fromJson(e as Map<String, dynamic>))
        ?.toList(),
    subscribers: (json['subscribers'] as List)
        ?.map((e) =>
            e == null ? null : Author.fromJson(e as Map<String, dynamic>))
        ?.toList(),
    columns: (json['columns'] as List)
        ?.map((e) =>
            e == null ? null : MyColumn.fromJson(e as Map<String, dynamic>))
        ?.toList(),
    banners: (json['banners'] as List)
        ?.map((e) =>
            e == null ? null : MyBanner.fromJson(e as Map<String, dynamic>))
        ?.toList(),
  );
}

Map<String, dynamic> _$MyResponseToJson(MyResponse instance) =>
    <String, dynamic>{
      'has_more': instance.hasMore,
      'last_key': instance.lastKey,
      'column': instance.column,
      'article': instance.article,
      'feeds': instance.feeds,
      'authors': instance.authors,
      'subscribers': instance.subscribers,
      'columns': instance.columns,
      'banners': instance.banners,
    };

MyResult _$MyResultFromJson(Map<String, dynamic> json) {
  return MyResult(
    meta: json['meta'] == null
        ? null
        : Meta.fromJson(json['meta'] as Map<String, dynamic>),
    response: json['response'] == null
        ? null
        : MyResponse.fromJson(json['response'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$MyResultToJson(MyResult instance) => <String, dynamic>{
      'meta': instance.meta,
      'response': instance.response,
    };
