export const copy = (text: string) => {
        try {

            navigator?.clipboard?.writeText(text)
        } catch(e){
            alert(e)
        }
}