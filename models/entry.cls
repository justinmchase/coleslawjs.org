model Entry {
    field auto id eid: string
    field text: string
    
    validate eid: uuid
    validate text: required // max(32)
}

module.exports = Entry
