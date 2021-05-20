import 'package:json_annotation/json_annotation.dart';
part 'model.g.dart';

@JsonSerializable()
class MyColumn {
  String name;
  int id;
  String icon;
  String image;
  String description;
  @JsonKey(name: 'subscriber_num')
  int subscriberNum;
  @JsonKey(name: 'content_provider')
  String contentProvider;
  int location;
  @JsonKey(name: 'show_type')
  int showType;
  MyColumn({this.name, this.id, this.icon, this.location, this.showType, this.description, this.subscriberNum});
  factory MyColumn.fromJson(Map<String, dynamic> json) => _$MyColumnFromJson(json);
  Map<String, dynamic> toJson() => _$MyColumnToJson(this);
}

@JsonSerializable()
class Category {
  String title;
  int id;
  @JsonKey(name: 'image_lab')
  String imageLab;
  Category({this.title, this.id, this.imageLab});
  factory Category.fromJson(Map<String, dynamic> json) => _$CategoryFromJson(json);
  Map<String, dynamic> toJson() => _$CategoryToJson(this);
}

@JsonSerializable()
class Post {
  int id;
  int genre;
  Category category;
  @JsonKey(name: 'column')
  MyColumn column;
  String title;
  String description;
  @JsonKey(name: 'publish_time')
  int publishTime;
  String image;
  @JsonKey(name: 'start_time')
  int startTime;
  @JsonKey(name: 'comment_count')
  int commentCount;
  @JsonKey(name:'comment_status')
  bool commentStatus;
  @JsonKey(name: 'praise_count')
  int praiseCount;
  @JsonKey(name: 'super_tag')
  String superTag;
  @JsonKey(name: 'page_style')
  int pageStyle;
  @JsonKey(name: 'post_id')
  int postId;
  String appview;
  @JsonKey(name:'file_length')
  String fileLength;
  String dataType;
  Post({
    this.id,
    this.genre,
    this.title,
    this.description,
    this.publishTime,
    this.image,
    this.startTime,
    this.commentCount,
    this.commentStatus,
    this.praiseCount,
    this.superTag,
    this.pageStyle,
    this.postId,
    this.appview,
    this.fileLength,
    this.dataType,
    this.category,
    this.column
  });
  factory Post.fromJson(Map<String, dynamic> json) => _$PostFromJson(json);
  Map<String, dynamic> toJson() => _$PostToJson(this);
}

@JsonSerializable()
class MyBanner {
  int type;
  String image;
  Post post;
  MyBanner({this.type, this.image, this.post});
  factory MyBanner.fromJson(Map<String, dynamic> json) => _$MyBannerFromJson(json);
  Map<String, dynamic> toJson() => _$MyBannerToJson(this);
}

@JsonSerializable()
class Meta {
  int status;
  String msg;
  Meta({this.status, this.msg});
  factory Meta.fromJson(Map<String, dynamic> json) => _$MetaFromJson(json);
  Map<String, dynamic> toJson() => _$MetaToJson(this);
}

@JsonSerializable()
class Article {
  int id;
  String body;
  List<String> js;
  List<String> css;
  List<String> image;
  Article({this.id, this.body, this.js, this.css, this.image});
  factory Article.fromJson(Map<String, dynamic> json) => _$ArticleFromJson(json);
  Map<String, dynamic> toJson() => _$ArticleToJson(this);
}

@JsonSerializable()
class News {
  String description;
  News({this.description});
  factory News.fromJson(Map<String, dynamic> json) => _$NewsFromJson(json);
  Map<String, dynamic> toJson() => _$NewsToJson(this);
}

@JsonSerializable()
class Feed {
  String image;
  int type;
  @JsonKey(name: 'index_type')
  int indexType;
  Post post;
  @JsonKey(name: 'news_list')
  List<News> newsList;
  Feed({this.image, this.type, this.post, this.indexType, this.newsList});
  factory Feed.fromJson(Map<String, dynamic> json) => _$FeedFromJson(json);
  Map<String, dynamic> toJson() => _$FeedToJson(this);
}

@JsonSerializable()
class Author {
  int id;
  String description;
  String avatar;
  String name;
  Author({this.id, this.description, this.avatar, this.name});
  factory Author.fromJson(Map<String, dynamic> json) => _$AuthorFromJson(json);
  Map<String, dynamic> toJson() => _$AuthorToJson(this);
}

@JsonSerializable()
class MyResponse {
  @JsonKey(name: 'has_more')
  bool hasMore;
  @JsonKey(name: 'last_key')
  var lastKey;
  MyColumn column;
  Article article;
  List<Feed> feeds;
  List<Author> authors;
  List<Author> subscribers;
  List<MyColumn> columns;
  List<MyBanner> banners;
  MyResponse({
    this.column,
    this.hasMore,
    this.lastKey,
    this.article,
    this.feeds,
    this.authors,
    this.subscribers,
    this.columns,
    this.banners
  });
  factory MyResponse.fromJson(Map<String, dynamic> json) => _$MyResponseFromJson(json);
  Map<String, dynamic> toJson() => _$MyResponseToJson(this);
}

@JsonSerializable()
class MyResult {
  @JsonKey(name: 'meta')
  Meta meta;
  @JsonKey(name: 'response')
  MyResponse response;
  MyResult({this.meta, this.response});
  factory MyResult.fromJson(Map<String, dynamic> json) => _$MyResultFromJson(json);
  Map<String, dynamic> toJson() => _$MyResultToJson(this);
}
