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

async function searchBlogs(keyword, page = 1, perPage = 10) {

    const  query = {}
    if(keyword && keyword!==''){
        query["multi_match"]={
            query: keyword,
            fields: ['title', 'content'],
        }
    }else{
        query["match_all"]={}
    }

    const response = await esClient.search({
        index: 'blogs',
        body: {
            from: (page - 1) * perPage,
            size: perPage,
            query,
        },
    });

    const hits = response.hits.hits;
    const total = response.hits.total.value;

    return {
        items: hits.map((hit) => hit._source),
        meta: {
            page,
            perPage,
            total,
            totalPages: Math.ceil(total / perPage),
        },
    };
}

export { searchBlogs };
