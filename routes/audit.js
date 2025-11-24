const express = require("express");
const router = express.Router();
const db = global.db;

router.get("/", (req, res) => {
    const sql = "SELECT * FROM audit_log ORDER BY timestamp DESC";

    db.query(sql, (err, rows) => {
        if (err) return res.send("Audit page error.");
        res.render("audit", { logs: rows });
    });
});

module.exports = router;
