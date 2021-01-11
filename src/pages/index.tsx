import * as React from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import "./style.css";
// markup
const Home = () => {
  const APOLLO_Query = gql`
    {
      BookMarkList {
        id,
        bookmarkname,
        url
      }
    }
  `
  const ALL_BOOKMARKS = gql`
    mutation addNewBookmark ($url : String! , $bookmarkname: String!) {
      addNewBookmark (url : $url , bookmarkname : $bookmarkname) {
        id
      }
    }
  `
  const { loading, data, error } = useQuery(APOLLO_Query);
  const [addNewBookmark] = useMutation(ALL_BOOKMARKS);
  let url: HTMLInputElement;
  let bookmarkname: HTMLInputElement;
  const handleSubmit = () => {
    addNewBookmark({
      variables: {
        url: url.value,
        bookmarkname: bookmarkname.value
      },
      refetchQueries: [{ query: APOLLO_Query }]
    })
  }
  if (error) {
    return <h1>{error.message}</h1>
  }

  if (loading) {
    return <h1>
      The data is being loaded
    </h1>
  }
  console.log(data)
  return (
    <div className = "Container">
      <h3 className = "heading">BookMark Application</h3>
      <label>
        Bookmark Name : <br />
        <input type="text" ref={node => bookmarkname = node} />
      </label>

      <br />
      <label>
        URL of the site: <br />
        <input type="text" ref={node => url = node} />
      </label>
      <br />
      <button onClick={handleSubmit}>Add Bookmark</button>
      <br/>
      {data.BookMarkList.map((task: { url: React.ReactNode }, id: React.Key) => 
        <span key = {id} >{task.url}</span>
        )}
    </div>
  )
}

export default Home;
