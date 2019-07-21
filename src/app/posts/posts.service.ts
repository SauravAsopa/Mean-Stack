import { AuthService } from './../auth/signup/auth.service';
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import {  Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostsService {
   posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private route: Router,
    private authservice: AuthService ) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              creator: post.creator
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        console.log(transformedPosts);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id: id, title: title, content: content};
    this.http.put("http://localhost:3000/api/posts/" + id, post).subscribe(
      response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.route.navigate(['/']);
      }
    );
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; postId: string }>(
        "http://localhost:3000/api/posts",
        post
      )
      .subscribe(res => {
        const id = res.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.route.navigate(['/'])
      });
  }

  deletePost(postId: string) {
    this.http
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPost = this.posts.filter(post => post.id != postId);
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
