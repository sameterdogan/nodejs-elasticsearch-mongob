import Blog from "../../models/blog.js";

export const checkSlug=async (slug)=>{
    let result= await Blog.exists({slug})
    return result;
}
