const fs = require('fs');
const path = require('path');

const _ = require("lodash");
const YAML = require('yaml');
const handlebars = require("handlebars");

const templateSource = fs.readFileSync('./template.handlebars').toString();
const template = handlebars.compile(templateSource);

const getFiles = path => {
    const files = []
    for (const file of fs.readdirSync(path)) {
        const fullPath = path + '/' + file
        if(fs.lstatSync(fullPath).isDirectory())
            getFiles(fullPath).forEach(x => files.push(file + '/' + x))
        else files.push(file)
    }
    return files
}

(async function () {
    const files = getFiles("pages");

    //TODO: fazer ele ler tudo q n for png

    // finding the files we need to process
    const yaml_files_path = _.filter(files, o => o.indexOf("yaml") != -1);


    const data = [];
    for(var file_path of yaml_files_path) {
        const file_content = fs.readFileSync(path.resolve(__dirname, `pages/${file_path}`)).toString();
        const yaml_content = YAML.parse(file_content);
        data.push(yaml_content)
    }

    // TODO separa em semente, muda, pre bonsai e bonsai
    var handlebars_input = template({ data: data});

    fs.writeFileSync('index.html', handlebars_input, 'utf-8');
})();