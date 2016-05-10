model Entry {
    field auto id eid: string
    
    validate eid: uuid
}

module.exports = Entry
