function AddProject({closeModal}) {

    const handleClick = (e) => {
        e.preventDefault();
        closeModal();
    };
    return (
        <form>
            <setcion>
                <p>Name</p>
                <input type="text" />
            </setcion>
            <setcion>
                <p>Description</p>
                <textarea></textarea>
            </setcion>
            <section>
                <p>Status</p>
                <select>
                <option name="status" value="planning">Planning</option>
                <option name="status" value="active">Active</option>
                </select>
            </section>
            <button onClick={handleClick}>Add</button>
        </form>
    )
}

export default AddProject;