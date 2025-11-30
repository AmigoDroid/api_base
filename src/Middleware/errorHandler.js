export default function(err, req, res, next) {

    console.error(`🔥 ERRO:`, {
        message: err.message,
        code: err.code,
        status: err.status
    });

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Erro interno no servidor",
        code: err.code || "SERVER_ERROR"
    });
};
