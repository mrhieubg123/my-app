// Cấu hình danh sách Factory khả dụng cho từng page theo dep và page_name
// Nếu một page không được cấu hình ở đây, mặc định sẽ khả dụng cho tất cả Factory.
export const PAGE_FACTORY_MAPPING = {
    fatp: {
        fatpmachinecontrol: ["A02", "BN3", "B06"],
        failureanalysis: ["A02", "BN3", "B06"],
        gluescrewstatus: ["A02"],
        vcutmachinestatus: ["A02"],
        maintenancestatus: ["A02"],
        voltagemonitor: ["A02"],
        projectmanagement: ["A02"],
        metdocument: ["A02"],
        yieldratepth: ["A02"],
        aoipicture: ["A02"],
    },
    // mpe: {
    //     esdcontrol: ["A02"],
    //     spareparts: ["A02"],
    //     datagelscreen: ["A02"],
    // },
    // Bạn có thể dễ dàng thêm cấu hình giới hạn cho các trang khác ở đây:
    // ví dụ:
    // fatp: {
    //     projectmanagement: ["A02", "BN3"],
    // }
};

export const checkPageSupport = (dep, pageName, factory) => {
    if (!dep || !pageName || !factory) return true;
    const d = dep.toLowerCase();
    const p = pageName.toLowerCase();
    const f = factory.toUpperCase();

    if (PAGE_FACTORY_MAPPING[d] && PAGE_FACTORY_MAPPING[d][p]) {
        const allowedFactories = PAGE_FACTORY_MAPPING[d][p];
        // Chuyển toàn bộ danh sách allowed sang chữ in hoa để so sánh chính xác
        return allowedFactories.map(item => item.toUpperCase()).includes(f);
    }

    return true; // Mặc định khả dụng nếu không cấu hình giới hạn
};
