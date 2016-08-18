export default function instance(Ctor) {
    try {
        return new Ctor();
    } catch (e) {
        throw new Error(`Exception while creating new instance for ${Ctor}.`
                        + ` Please make sure ${Ctor} supports no-argument constructor: ${e}`);
    }
}
