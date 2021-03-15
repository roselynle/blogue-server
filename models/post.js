const postsData = require('../posts.json');
const fs = require("fs");



class Post {
    constructor({id, title, comments=[], reactions={} }) {
        this.id = id,
        this.title = title,
        this.comments = comments,
        this.reactions = reactions
    }

    static get all() {
        const posts = postsData.map(post => new Post(post));
        return posts;
    }

    static findByID(id) {
        try {
            const Data = postsData.find(post => post.id === id);
            const post = new Post(Data);
            return post;
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }

    static sortPost() {
        const arr = []
        Post.all.forEach( post => { arr[postsData.length-post.id] = post })
        return arr
    }

    static async createPost(data) {
        let maxId = 0;
        Post.all().forEach( post => {
            if (post.id > maxId)  {
                maxId = post.id
            }
        })
        data.id = maxId + 1;
        postsData.push(data);
        await fs.writeFile("../posts.json", JSON.stringify(postsData), err => { 
            // Checking for errors 
            if (err) throw err;  

            console.log("Done writing"); // Success 
         })
         return Post.all
    }

    static addComment(id, comment) {
        const post = this.findByID(id);
        post.comments.push(comment)
        fs.writeFile("../posts.json", JSON.stringify(postsData), err => { 
            // Checking for errors 
            if (err) throw err;  

            console.log("Done adding comment"); // Success 
         })
    }

    static addEmoji(id, e) {
        const post = this.findByID(id);
        const emoji = e;
        post.reactions[emoji]++
        fs.writeFile("../posts.json", JSON.stringify(postsData), err => { 
            // Checking for errors 
            if (err) throw err;  

            console.log("Done adding comment"); // Success 
         })
    }

    static async deletePost(id) {
        const newPostsData = postsData.filter(post => !(post.id === id))
        await fs.writeFile("../posts.json", JSON.stringify(newPostsData), err => { 
            // Checking for errors 
            if (err) throw err;  

            console.log("Done deleting post"); // Success 
         })
        
        return Post.all
    }

    static sortPosts(array, comparison) {
        // array is the array to sort
        // comparison = 0 for ascending ids, 1 for descending ids, 2 for descending most comments/reactions total
        if (array.length > 1){
            let previous = []
            let following = []
            let pivot = array[array.length - 1];
            for(let i = 0; i < array.length - 1; i++) {
                post = array[i];
                if (comparison === 0 && post.id < pivot.id) {
                    previous.push(post)
                } else if (comparison === 0 && post.id > pivot.id) {
                    previous.push(post)
                } else if (comparison === 0) {
                    if (post.comments.length + Object.keys(post).reduce((sum,key)=>sum+post[key]) < pivot.comments.length + Object.keys(pivot).reduce((sum,key)=>sum+pivot[key])) {
                        previous.push(post)
                    }
                    else {
                        following.push(post)
                    }
                } else {
                    following.push(post)
                }
            }
            return sortPosts(previous, comparison).concat(sortPosts(following, comparison))
        }
        else {
            return array;
        }
    }

}





module.exports = Post;