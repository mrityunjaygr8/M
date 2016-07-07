module.exports = {
    'facebookAuth': {
        'clientID': process.env.PM_FB_ID,
        'clientSecret': process.env.PM_FB_SECRET,
        'callbackURL': process.env.PM_FB_URL
    },
    'twitterAuth': {
        'consumerKey': process.env.PM_TW_KEY,
        'consumerSecret': process.env.PM_TW_SECRET,
        'callbackURL': process.env.PM_TW_URL,
    },
    'googleAuth': {
        'clientID': process.env.PM_FB_ID,
        'clientSecret': process.env.PM_FB_SECRET,
        'callbackURL': process.env.PM_FB_URL
    }
};
