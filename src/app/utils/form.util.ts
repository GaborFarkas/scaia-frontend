/**
 * Converts a simple object to a FormData object, which can be used in a POST request.
 * NOTE: Use only with simple objects!
 * @param model Object to convert
 */
export function modelToFormData(model: Object) : FormData {
    const fd = new FormData();

    for (let attr in model) {
        fd.append(attr, model[attr]);
    }

    return fd;
}