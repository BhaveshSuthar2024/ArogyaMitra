const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => next(error));
    }
}

export default asyncHandler