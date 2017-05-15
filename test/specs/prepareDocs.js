import MyDocument from './model/MyDocument';
import MyElement from './model/MyElement';

export default function prepareDocs(docAmount = 1, bodyCapacity = 1, elementDepth = 1) {
    var docs = [];

    for (var i = 0; i < docAmount; i++) {
        let doc = new MyDocument({
            name: `doc#${i}`
        });
        docs.push(doc);
        doc.body.capacity = bodyCapacity;

        let divs = doc.body.children;
        for (var j = 0; j < doc.body.capacity; j++) {
            let div = new MyElement({
                name: `div#${i}-${j}`
            });
            divs.push(div);

            div.parent = doc.body;
            div.depth = elementDepth;

            let parent = div;
            for (var k = 0; k < div.depth; k++) {
                let el = new MyElement({
                    name: `el#${i}-${j}-${k}`
                });
                parent.children.push(el);

                el.parent = parent;
                parent = el;
            }
        }
    }

    return docs;
}
