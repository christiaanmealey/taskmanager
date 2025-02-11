const requestCounts = {};

export const rateLimit = (options) => {
    const { windowMs, maxRequests } = options;

    return (req, res, next) => {
        const ip = req.ip;
        if(!requestCounts[ip]) {
            requestCounts[ip] = {
                count: 1,
                firstRequestTime: Date.now()
            };
        } else {
            const timeDifference = Date.now() - requestCounts[ip].firstRequestTime;
            if(timeDifference > windowMs) {
                requestCounts[ip].timeDifference = Date.now();
            } else {
                requestCounts[ip].count += 1;
            }
            
            if(requestCounts[ip].count > maxRequests) {
                return res.status(429).json({message: 'Too many requests. Please try again later'});
            }
        }
        next();
    }
};