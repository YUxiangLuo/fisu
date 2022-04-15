const https = require('https')
const util = require('util')
const { Base64 } = require('js-base64')
const { dialog } = require('electron')
const { default: axios } = require('axios')

module.exports.handle_file_open = async function () {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
        return
    } else {
        return filePaths[0]
    }
}


module.exports.handle_get_nodes = async function (event, args) {
    const url = args[0];
    const ares = await axios.get(url);
    const data = ares.data;
    nodes = decodeURI(Base64.decode(data)).split("\r\n");
    nodes.splice(nodes.length - 1, 1);

    const nodes_ = nodes.map((node) => {
        if (node.startsWith("vmess://")) {
            let info = node.replace("vmess://", "");
            info = Base64.decode(info).toString();
            info = JSON.parse(info);
            return {
                name: info.ps.split(" ")[0],
                name_full: info.ps,
                protocol: "Vmess",
                lantency: 0
            };
        } else if (node.startsWith("trojan://")) {
            let info = new URL(node);
            info = JSON.stringify(info);
            let name_full = decodeURIComponent(info.split("#")[1]).replace("\"", "");
            return {
                name: name_full.split(" ")[0],
                name_full,
                protocol: "Trojan",
                lantency: 0
            };
        } else if (node.startsWith("ss://")) {
            let info = new URL(node);
            info = JSON.stringify(info);
            let name_full = decodeURIComponent(info.split("#")[1]).replace("\"", "");
            return {
                name: name_full.split(" ")[0],
                name_full,
                protocol: "Shadowsocks",
                lantency: 0
            };
        }
    })
    return nodes_;
}