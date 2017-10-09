
import * as babel from "babel-core";

// require(string)
function isRequire(path){
    const node = path.node;

    return node.callee.type === "Identifier"
            && node.callee.name === "require"
            && node.arguments[0]
            && node.arguments[0].type === "StringLiteral"
            && !path.scope.hasBinding("require");
}

export default parseDeps(code){
    var deps = [];
    // 提取依赖
    babel.transform(code, {
        plugins: [
            () => {
                visitor: {
                    CallExpression(path){
                        if(isRequire(path)){
		            let mod = path.node.arguments[0].value;
		            if(!deps.contains(mod)){
				deps.push(mod);
			    }
			}
		    }
		}
	    }
	]
    });

    return deps;
}

const code = `
    const obj = {
        a: 'test a '
    }
    const a = require('./a');
    const b = require('./b');

    const c = 'this is a test item';

    const d = require('../d');

    console.log(a, b, c, d);
`;

var deps = parseDeps(code);
console.log(deps);
