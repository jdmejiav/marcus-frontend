const line = {
    id: { view: true, edit: false, hideable: true },
    actions: { view: false, edit: false, hideable: false },
    date: { view: true, edit: false, hideable: true },
    customer: { view: true, edit: false, hideable: true },
    product: { view: true, edit: false, hideable: true },
    po: { view: true, edit: false, hideable: true },
    poDescription: { view: true, edit: false, hideable: true },
    dry_boxes: { view: true, edit: false, hideable: true },
    pull_date: { view: true, edit: false, hideable: true },
    wet_pack: { view: true, edit: false, hideable: true },
    comment: { view: true, edit: false, hideable: true },
    priority: { view: true, edit: false, hideable: true },
    wo: { view: true, edit: false, hideable: true },
    exit_order: { view: false, edit: false, hideable: true },
    line: { view: true, edit: false, hideable: true },
    turno: { view: false, edit: false, hideable: false },
    assigned: { view: true, edit: false, hideable: false },
    made: { view: false, edit: false, hideable: false },
    order_status: { view: true, edit: false, hideable: true },
    scan_status: { view: true, edit: false, hideable: true },
    box_code: { view: true, edit: false, hideable: true },
    hargoods: { view: true, edit: false, hideable: true },
    hargoods_status: { view: true, edit: false, hideable: true },
}

export const Roles = {
    "admin": {
        id: { view: true, edit: true, hideable: true },
        actions: { view: true, edit: true, hideable: true },
        date: { view: true, edit: true, hideable: true },
        customer: { view: true, edit: true, hideable: true },
        product: { view: true, edit: true, hideable: true },
        po: { view: true, edit: true, hideable: true },
        poDescription: { view: true, edit: true, hideable: true },
        dry_boxes: { view: true, edit: true, hideable: true },
        pull_date: { view: true, edit: true, hideable: true },
        wet_pack: { view: true, edit: true, hideable: true },
        comment: { view: true, edit: true, hideable: true },
        priority: { view: true, edit: true, hideable: true },
        wo: { view: true, edit: true, hideable: true },
        exit_order: { view: true, edit: true, hideable: true },
        line: { view: true, edit: true, hideable: true },
        turno: { view: true, edit: true, hideable: true },
        assigned: { view: true, edit: true, hideable: true },
        made: { view: true, edit: true, hideable: true },
        order_status: { view: true, edit: true, hideable: true },
        scan_status: { view: true, edit: true, hideable: true },
        box_code: { view: true, edit: true, hideable: true },
        hargoods: { view: true, edit: true, hideable: true },
        hargoods_status: { view: true, edit: true, hideable: true },
    },
    "planeacion": {
        id: { view: true, edit: false, hideable: false },
        actions: { view: true, edit: true, hideable: true },
        date: { view: true, edit: true, hideable: true },
        customer: { view: true, edit: true, hideable: true },
        product: { view: true, edit: true, hideable: true },
        po: { view: true, edit: true, hideable: true },
        poDescription: { view: true, edit: true, hideable: true },
        dry_boxes: { view: true, edit: true, hideable: true },
        pull_date: { view: true, edit: true, hideable: true },
        wet_pack: { view: true, edit: true, hideable: true },
        comment: { view: true, edit: true, hideable: true },
        priority: { view: true, edit: true, hideable: true },
        wo: { view: true, edit: true, hideable: true },
        exit_order: { view: true, edit: true, hideable: true },
        line: { view: true, edit: true, hideable: true },
        turno: { view: true, edit: true, hideable: true },
        assigned: { view: false, edit: true, hideable: true },
        made: { view: false, edit: true, hideable: true },
        order_status: { view: true, edit: true, hideable: true },
        scan_status: { view: true, edit: true, hideable: true },
        box_code: { view: true, edit: true, hideable: true },
        hargoods: { view: true, edit: true, hideable: true },
        hargoods_status: { view: true, edit: true, hideable: true },
    },
    "hargoods": {
        id: { view: true, edit: true, hideable: true },
        actions: { view: false, edit: false, hideable: false },
        date: { view: true, edit: true, hideable: true },
        customer: { view: true, edit: true, hideable: true },
        product: { view: true, edit: true, hideable: true },
        po: { view: false, edit: false, hideable: false },
        poDescription: { view: false, edit: false, hideable: false },
        dry_boxes: { view: false, edit: false, hideable: false },
        pull_date: { view: false, edit: false, hideable: true },
        wet_pack: { view: true, edit: false, hideable: true },
        comment: { view: true, edit: true, hideable: true },
        priority: { view: true, edit: false, hideable: true },
        wo: { view: true, edit: false, hideable: true },
        exit_order: { view: true, edit: false, hideable: true },
        line: { view: true, edit: false, hideable: true },
        turno: { view: false, edit: false, hideable: true },
        assigned: { view: false, edit: false, hideable: true },
        made: { view: true, edit: false, hideable: true },
        order_status: { view: true, edit: true, hideable: true },
        scan_status: { view: true, edit: true, hideable: true },
        box_code: { view: true, edit: false, hideable: true },
        hargoods: { view: true, edit: true, hideable: true },
        hargoods_status: { view: true, edit: true, hideable: true },
    },
    "receiving": {
        id: { view: true, edit: true, hideable: true },
        actions: { view: true, edit: true, hideable: true },
        date: { view: true, edit: true, hideable: true },
        customer: { view: true, edit: true, hideable: true },
        product: { view: true, edit: true, hideable: true },
        po: { view: true, edit: true, hideable: true },
        poDescription: { view: true, edit: true, hideable: true },
        dry_boxes: { view: true, edit: true, hideable: true },
        pull_date: { view: true, edit: true, hideable: true },
        wet_pack: { view: true, edit: true, hideable: true },
        comment: { view: true, edit: true, hideable: true },
        priority: { view: true, edit: true, hideable: true },
        wo: { view: true, edit: true, hideable: true },
        exit_order: { view: true, edit: true, hideable: true },
        line: { view: true, edit: true, hideable: true },
        turno: { view: true, edit: true, hideable: true },
        assigned: { view: true, edit: true, hideable: true },
        made: { view: true, edit: true, hideable: true },
        order_status: { view: true, edit: true, hideable: true },
        scan_status: { view: true, edit: true, hideable: true },
        box_code: { view: true, edit: false, hideable: true },
        hargoods: { view: true, edit: false, hideable: true },
        hargoods_status: { view: true, edit: false, hideable: true },
    },
    "produccion": {
        id: { view: true, edit: false, hideable: true },
        actions: { view: true, edit: false, hideable: true },
        date: { view: true, edit: false, hideable: true },
        customer: { view: true, edit: false, hideable: true },
        product: { view: true, edit: false, hideable: true },
        po: { view: true, edit: false, hideable: true },
        poDescription: { view: true, edit: false, hideable: true },
        dry_boxes: { view: true, edit: false, hideable: true },
        pull_date: { view: true, edit: false, hideable: true },
        wet_pack: { view: true, edit: false, hideable: true },
        comment: { view: true, edit: false, hideable: true },
        priority: { view: true, edit: false, hideable: true },
        wo: { view: true, edit: false, hideable: true },
        exit_order: { view: true, edit: false, hideable: true },
        line: { view: true, edit: true, hideable: true },
        turno: { view: true, edit: false, hideable: true },
        assigned: { view: true, edit: false, hideable: true },
        made: { view: true, edit: false, hideable: true },
        order_status: { view: true, edit: false, hideable: true },
        scan_status: { view: true, edit: false, hideable: true },
        box_code: { view: true, edit: false, hideable: true },
        hargoods: { view: true, edit: false, hideable: true },
        hargoods_status: { view: true, edit: false, hideable: true },
    },
    "LINE 1": line,
    "LINE 2": line,
    "LINE 3": line,
    "LINE 4": line,
    "LINE 5": line,
    "LINE 6": line,
    "LINE 7": line,
    "LINE 8": line,
    "LINE 9": line,
    "LINE 11": line,
    "Vase L1": line,
    "Vase L2": line,
    "Vase L3": line,
    "Vase L4": line,
    "LINE 10 (eComerce)": line,
    "LINE Dry": line,
}

export const RolesBotones = ["admin","planeacion","receiving"]

export const RolesLineas = {
    "LINE 1": line,
    "LINE 2": line,
    "LINE 3": line,
    "LINE 4": line,
    "LINE 5": line,
    "LINE 6": line,
    "LINE 7": line,
    "LINE 8": line,
    "LINE 9": line,
    "LINE 11": line,
    "Vase L1": line,
    "Vase L2": line,
    "Vase L3": line,
    "Vase L4": line,
    "LINE 10 (eComerce)": line,
    "LINE Dry": line,
}