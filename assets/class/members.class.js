let db, config

module.exports = (_db, _config) => {
    db = _db
    config = _config

    return Members
}

let Members = class {

    static getById(id) {

        return new Promise((callback) => {
            db.query('SELECT * FROM members WHERE id = ?', [id])
                .then((result) => {
                    if (result[0] !== undefined) {
                        callback(result[0])
                    } else {
                        callback(new Error(config.errors.wrongID))
                    }
                })
                .catch((err) => callback(err))
        })
    }


    static getAll(max) {

        return new Promise((callback) => {
            if (max !== undefined && max > 0) {
                db.query('SELECT * FROM members LIMIT 0, ?', [parseInt(max)])
                    .then((result) => callback(result))
                    .catch((err) => callback(err))

            } else if (max !== undefined) {
                callback(new Error(config.errors.wrongMaxValue))

            } else {
                db.query('SELECT * FROM members')
                    .then((result) => callback(result))
                    .catch((err) => callback(err))
            }
        })


    }

    static add(name) {

        return new Promise((callback) => {
            if(name !== undefined && name.trim() !== '') {
                name = name.trim()

                db.query('SELECT * FROM members WHERE name = ?', [name])
                    .then((result) => {

                        if(result[0] !== undefined) {
                            callback(new Error(config.errors.nameAlreadyTaken))
                        } else {
                            return db.query('INSERT INTO members(name) VALUES(?)', [name])
                        }
                    })
                    .then(() => {

                        return db.query('SELECT * FROM members WHERE name = ?', [name])
                    })
                    .then((result) => {
                        callback({
                            id: result[0].id,
                            name: result[0].name,
                        })
                    })
                    .catch((err) => callback(err))

            } else {
                callback(new Error(config.errors.noNameValue))
            }
        })
    }

    static update(id, name) {

        return new Promise((callback) => {

            if(name !== undefined && name.trim() !== '') {
                name = name.trim()

                db.query('SELECT * FROM members WHERE id = ?', [id])
                    .then((result) => {
                        if(result[0] !== undefined) {
                            return db.query('SELECT * FROM members WHERE name = ? AND id != ?', [name,id])
                        } else {
                            callback(new Error(config.errors.wrongID))

                        }
                    })
                    .then((result) => {
                        if(result[0] !== undefined) {
                            callback(new Error(config.errors.sameName))
                        } else {
                            return db.query('UPDATE members SET name = ? WHERE id = ?', [name,id])
                        }
                    })
                    .then(() => callback(true))
                    .catch((err) => callback(err))

            } else {
                callback(new Error(config.errors.noNameValue))
            }
        })
    }

    static delete(id) {

        return new Promise((callback) => {

            db.query('SELECT * FROM members WHERE id = ?', [id])
                .then((result) => {
                    if(result[0] !== undefined) {
                        return db.query('DELETE FROM members WHERE id = ?', [id])
                    } else {
                        callback(new Error(config.errors.wrongID))

                    }
                })
                .then(() => callback(true))
                .catch((err) => callback(err))

        })
    }
}