
import * as cheerio from 'cheerio';
import axios from "axios"
import fs from "fs"
import request from "request"
import slugify from "slugify"
import path from 'path';
import {checkSlug} from "./botUtil.js";

export const scraping = async () =>{
    try {
        // downloading the target web page
        // by performing an HTTP GET request in Axios
        const posts=[];
        const payload={
            pageNum: 1,
            count: 20,
            haberKategori:3
        }
        const baseUrl="https://www.kizilay.org.tr";
        const axiosResponse = await axios.post(`https://www.kizilay.org.tr/Haber/HaberListe`,payload,{
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
            }
        })

        const $ = cheerio.load(axiosResponse.data)


        const promises = $(".item-box").map(async (index,item)=>{
            const post={};
            const pageUrl = $(item).find(".item-hover").attr("href");

            //dış sayfadan alınan bilgiler
            post['thumbnail']=$(item).find(".img-responsive").attr("src");
            post['title']=$(item).find(".item-box-desc h4 a").html();
            post['date']=$(item).find(".item-box-desc small").html();
            post['thumbnail']=baseUrl+post['thumbnail'];
            post['category']="www.kizilay.org.tr"
            let slug = slugify(post.title, {replacement: '-', remove: /[*+~.()?'"!:@#]/g, lower: true, })
            const checkSlugResult = await checkSlug(slug);
            if(checkSlugResult) return;
            const dirPath = "assets/image"
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            let thumbnailPath = `${dirPath}/${slug}-thumbnail.png`;
            request(post['thumbnail']).pipe(fs.createWriteStream(thumbnailPath));
            post['thumbnail']=process.env.URL+thumbnailPath;

            // iç sayfa isteği
            const axiosResponseInnerPage = await axios.request({
                method: "GET",
                url: `${baseUrl}${pageUrl}`,
            })
            const $innerPage = cheerio.load(axiosResponseInnerPage.data)

            post['preview']=baseUrl+$innerPage(".col-md-9 .img-responsive.pb-10").attr("src");
            let previewPath = `${dirPath}/${slug}-preview.png`;
            request(post['preview']).pipe(fs.createWriteStream(previewPath));
            post['preview']=process.env.URL+previewPath;
            $innerPage(".col-md-9 .img-responsive.pb-10").attr("src",post['preview'])
            //içerik
            //post["content"] = $innerPage(".clearfix.mt-30 + p").html();
            $innerPage(".col-md-9 .clearfix.mt-30 ").remove();

            //gallery
            post['gallery']=[];
            $innerPage(".masonry-gallery .image-hover").each((index,item)=>{
                $(item).attr("href","javascript:void(0)")
                let aInImgItem=$(item).find("img");
                let url= baseUrl+$innerPage(aInImgItem).attr("src");
                let gallaryPath = `${dirPath}/${slug}-gallery-${index}.png`;
                request(url).pipe(fs.createWriteStream(gallaryPath));
                gallaryPath=process.env.URL+gallaryPath;
                $innerPage(aInImgItem).attr("src",gallaryPath);

                post.gallery.push(gallaryPath);
            });
            post["content"] = $innerPage(".col-md-9").html();
            posts.push(post);
        })

        await Promise.all(promises);

        return posts;
    }catch (e){
        console.log(e)
    }
}






