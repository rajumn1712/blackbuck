import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Button, Space } from 'antd';


const GetColumnSearchProps = (dataIndex, renderFun) => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    let searchInput = "";
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };
    return ((
        {
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters
            }) => (
                <div className="filter-search custom-fields">
                    <Input
                        ref={(node) => {
                            searchInput = node;
                        }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(e.target.value ? [e.target.value] : [])
                        }
                        onPressEnter={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                    />
                    <div className="filter-buttons">
                        <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} size="small">Search</Button>
                        <Button type="default" onClick={() => handleReset(clearFilters)} size="small" className="secondary-btn">Reset</Button>
                        {/* <Button type="link"  size="small" onClick={() => { confirm({ closeDropdown: false }); setSearchText(selectedKeys[0]);setSearchedColumn(dataIndex) }}  >Filter</Button> */}
                    </div>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? "#07a3b2" : undefined }} />
            ),
            onFilter: (value, record) =>
                renderFun ? renderFun(value, record) : (record[dataIndex]
                    ? record[dataIndex]
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase())
                    : ""),
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.select(), 100);
                }
            },
            // render: (text) =>
            //     text
        }));
}

export default GetColumnSearchProps;