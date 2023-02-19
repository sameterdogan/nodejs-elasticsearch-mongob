import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

import slugify from "slugify";
import uniqId from "uniqid";

//elasticsearch
import { Client } from '@elastic/elasticsearch';
const esClient = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: "elastic",
        password: process.env.elasticsearch_password || "hZaQjTT0v5V2YFmm2Niw",
    },
    ssl: {
        ca: process.env.elasticsearch_certificate,
        rejectUnauthorized: false,
    },
});


const Schema = mongoose.Schema


const BlogSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            trim: true,
        },
        title: {
            type: String,
        },
        content: {
            type: String,
        },
        category: {
            type: String,
        },
        slug: {
            type: String,
        },

    },
    {
        timestamps: true,
    },
)


BlogSchema.pre('save', async function(next) {

    if (!this.isModified('title')) {
        return next()
    }

    this.slug = slugify(this.title, {        replacement: '-', remove: /[*+~.()?'"!:@#]/g, lower: true, });
    const existing = await this.constructor.find({
        title: this.title,
        slug: { $regex: `^${this.slug}(-[0-9]+)?$` }
    });
    if (existing.length) {
        let max = -1;
        existing.forEach(doc => {
            let match = doc.slug.match(/^.+-(\d+)$/);
            if (match && +match[1] > max) {
                max = +match[1];
            }
        });

        this.slug = `${this.slug}-${max + 1}`;
    }
    next();

})

BlogSchema.post('save', async function () {


    console.log(this);
   const result=  await esClient.index({
        index: 'blogs',
        id: this._id,
        body: {
            title: this.title,
            content: this.content,
            category: this.category,
            slug: this.slug,
        },
    });

});

//BlogSchema.plugin(mongoosePaginate);

export default mongoose.model('Blog', BlogSchema)
