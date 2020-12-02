const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = (temp, product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);
    output = output.replace(/{%FROM%}/g,product.from);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/,"not-organic");

    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url,true);

    //OVERVIEW
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200,{"Content_type": "text/html"});
        
        const cardsHTML = dataObj.map(el=>{
            return replaceTemplate(tempCard,el);
        }).join("");

        const output = tempOverview.replace("{%PRODUCT_CARDS%}",cardsHTML); 

        res.end(output);
    }
    //PRODUCT
    else if (pathname === "/product") {
        res.writeHead(200,{"Content_type": "text/html"});

        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);

        res.end(output);
    }
    //API
    else if (pathname === "/api") {

        res.writeHead(200, { "Content_type": "application/json" });
        res.end(data);
    }
    //NOT FOUND
    else {
        res.writeHead(404);
        res.end(`<h1>Page not found</h1>`);
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening to requests on port 8000");
});