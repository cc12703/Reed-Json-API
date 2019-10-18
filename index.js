const fs = require('fs'),
    Router = require('koa-router'),
    dummyJson = require('dummy-json'),
    { setBadRequest } = require('./lib/response')

//TODO: watch file changed for json template

module.exports = ({ urlPrefix, filePath }) => {
    const template = fs.readFileSync(filePath).toString(),
        jsonResult = dummyJson.parse(template),
        jsonData = JSON.parse(jsonResult),
        router = new Router({ prefix: urlPrefix || '' })

    router.get('/:name/:id?', require('./lib/get')(jsonData))
        .delete('/:name/:id?', require('./lib/delete')(jsonData))
        .all('/:name?', handleBadRequest)
        .post('/:name?', require('./lib/create')(jsonData))
        .put('/:name/:id?', require('./lib/update')(jsonData, false))
        .patch('/:name/:id?', require('./lib/update')(jsonData, true))

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

