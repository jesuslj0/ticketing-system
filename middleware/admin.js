export default function admin(req, res, next) {
    if (req.user.role != "admin") {
    res.status(403).json({
        message: "Access Denied, Don't have permission to perform this action."
    })}
    
    next();
}