const handler = async (event) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    const username = "admin";
    const password = "password123"; 
    
    const authHeader = headers.authorization;
    const expectedAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    
    if (authHeader && authHeader[0].value === expectedAuth) {
        return request;
    }
    
    return {
        status: '401',
        statusDescription: 'Unauthorized',
        headers: {
            'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Basic realm="Enter your credentials"' }],
            'content-type': [{ key: 'Content-Type', value: 'text/plain' }]
        },
        body: 'Unauthorized'
    };
};

exports.handler = handler;