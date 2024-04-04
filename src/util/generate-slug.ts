export function generateSlug(text:string): string {
    return text
        .normalize("NFD")
        .toLowerCase()
        .replace(/[^\w\s-]/g,"")
        .replace(/\s+/g,"-")
}