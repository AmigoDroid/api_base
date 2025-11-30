export default function (req, res, next) {
    const err = new Error("Rota não encontrada");
    err.status = 404;
    err.code = "ROUTE_NOT_FOUND";
    next(err);
};
