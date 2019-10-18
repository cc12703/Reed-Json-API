const fs = require('fs'),
    Router = require('koa-router'),
    dummyJson = require('dummy-json'),
    { setBadRequest } = require('./lib/response')

//TODO: watch file changed for json template

module.exports = (options) => {
    const { urlPrefix, filePath } = options,
        template = fs.readFileSync(filePath).toString(),
        jsonResult = dummyJson.parse(template),
        jsonData = JSON.parse(jsonResult),
        router = new Router({ prefix: urlPrefix || '' })

    router.get('/:name/:id?', require('./get')(jsonData))
        .delete('/:name/:id?', require('./delete')(jsonData))
        .all('/:name?', handleBadRequest)
        .post('/:name?', require('./create')(jsonData))
        .put('/:name/:id?', require('./update')(jsonData, false))
        .patch('/:name/:id?', require('./update')(jsonData, true))

    return router.routes()
}


async function handleBadRequest(ctx, next) {

    if (['POST', 'PUT', 'PATCH'].includes(ctx.method)) {
        let entity = ctx.request.body,
            entityType = typeof entity

        if (!entity || entityType != 'object' || entity.isEmpty()) {
            setBadRequest(ctx)
            return
        }
    }

    return await next()
}

