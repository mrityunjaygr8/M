module.exports = {
    'facebookAuth': {
        'clientID': process.env.PM_FB_ID,
        'clientSecret': process.env.PM_FB_SECRET,
        'callbackURL': process.env.PM_FB_URL
    },
    'twitterAuth': {
        'consumerKey': '',
        'consumerSecret': '',
        'callbackURL': '',
    },
    'googleAuth': {
        'clientID': process.env.PM_FB_ID,
        'clientSecret': process.env.PM_FB_SECRET,
        'callbackURL': process.env.PM_FB_URL
    }
};