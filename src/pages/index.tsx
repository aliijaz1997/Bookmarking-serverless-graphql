import * as React from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import "./style.css";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles({
  root: {
    maxWidth: 245,
  },
});

// GraphQL
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
const Home = () => {
  const classes = useStyles();
  const { loading, data, error } = useQuery(APOLLO_Query);
  const [addNewBookmark] = useMutation(ALL_BOOKMARKS);
  let url: any;
  let bookmarkname: any;
  const handleSubmit = () => {
    addNewBookmark({
      variables: {
        url: url.value,
        bookmarkname: bookmarkname.value
      },
      refetchQueries: [{ query: APOLLO_Query }],
    })
    url.value = "",
    bookmarkname.value = ""
  }
  if (error) {
    return <h1>{error.message}</h1>
  }

  if (loading) {
    return <h1>
      The data is being loaded
    </h1>
  }
  console.log(url)
  return (
    <div className="Container">
      <h1 className="heading">BookMark Application</h1>
      <TextField
        color="secondary"
        type="text" inputRef={node => bookmarkname = node} id="standard-basic" label="BookMark Name" />
      <br />
      <TextField
        color="secondary"

        type="text" inputRef={node => url = node} id="standard-basic" label="URL Link" />
      <br />
      <button
        className="button"
        onClick={handleSubmit}>Add Bookmark</button>
      <br />
      {data.BookMarkList.map((details: any, id: React.Key) =>
        <Card
        style = {{
          backgroundColor : "darkslategray"
        }}
        key={id} className= "card" >
          <CardActionArea>
            <CardContent className = "content" >
              <Typography gutterBottom variant="h5" component="h2">
                {details.bookmarkname}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="h1">
                {details.url}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Share
          </Button>
            <Button size="small" color="primary">
              Learn More
          </Button>
          </CardActions>
        </Card>
      )}
    </div>
  )
}

export default Home;
