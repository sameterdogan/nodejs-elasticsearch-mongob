import BlogModel from '../models/blog.js';
import {scraping} from "../util/getPosts/kizilay.js"
import CustomError from '../util/CustomError.js';
import {searchBlogs} from "../elasticsearch/searchBlogs.js";



export const paginateBlogs = async (req, res, next) => {

    try {
        const options = {
            page : req.query.page || 1,
            limit: 10,
            sort:{
                createdAt:-1,title:-1
            }
        };
        const query={};
        if(req.query.q  && req.query.q!==""){
            const searchTerm = req.query.q;
            const regex = new RegExp(searchTerm, "i");
            query['title']={$regex:regex};
           // query['$or']=[{"title":{$regex:regex}},{"content":{$regex:regex}}];
        }

        console.log(query)
        const blogs= await BlogModel.paginate(query,options);


        res.status(200).json({
            success: true,
            message: `Yazılar Başalrılı Bir Şekilde Listelendi.`,
            blogs
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
};

export const elasticSearchBlogs = async (req, res, next) => {

    try {
        const keyword = req.query.q || "";
        const page = Number(req.query.page) || 1;
        const perPage = Number(req.query.per_page) || 10;
        const blogs = await searchBlogs(keyword, page, perPage);

        res.status(200).json({
            success: true,
            message: `Yazılar Başalrılı Bir Şekilde Listelendi.`,
            blogs
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
};

export const getBlog = async (req, res, next) => {
    try {
        const blog = await BlogModel.findOne({slug:req.params.slug});
        res.status(200).json({
            success: true,
            message: `Yazı Başalrılı Bir Şekilde Getirildi.`,
            blog
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
};

export const createBlog = async (req, res, next) => {
    try {

        const input={};
        input.user=req.user.id;
        input.title=req.body.title;
        input.content=req.body.content;
        input.category=req.body.category;

      const blog =  await BlogModel.create({ ...input })

      if(blog){
          global.io.emit('newBlog', { "blog":blog });
      }
        res.status(200).json({
            success: true,
            message: `Blog Başarılı Bir Şekilde Eklendi`,
            blog
        })
    } catch (err) {
        next(err)
    }
};

export const updateBlog = async (req, res, next) => {
    try {


        res.status(200).json({
            success: true,
            message: `Blogs.`,
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
}

export const getBlogAndCreateKizilay = async (req, res, next) => {
    try {

       const blogs = await  scraping();
       if(blogs.length>0){
           await BlogModel.create(blogs);
       }

        res.status(200).json({
            success: true,
            message: "Kızılay haberleri getirildi",
            blogs
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
}
