export const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    const options = {
        expires: new Date(Date.now() + (process.env.EXPIRE_COOKIE || 7) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
    };

    const safeUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user: safeUser,
    });
};
