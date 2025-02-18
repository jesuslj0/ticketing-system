export default function paginate(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;
        
        const response = {};

        try {
            response.total = await model.countDocuments().exec();
            response.results = await model
            .find(req.filter)
            .skip(skip)
            .limit(pageSize)
            .exec();

            response.pages = Math.ceil(response.total / pageSize);
            response.currentPage = page;
            req.paginatedResults = response;
            next()
        } catch (error) {
            res.status(500).json({ message: error.message})
        }
    }
}