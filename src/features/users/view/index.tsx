import { users } from "../data/users";

export default function ViewUser({ id }: { id?: string }) {
    const user = users.find((p) => p.id === id)
    return <>
        teste
    </>;
}