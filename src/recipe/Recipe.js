import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardImg,
    CardBody,
    CardTitle,
    Button,
    Badge,
} from "reactstrap";
import { useParams } from "react-router-dom";
import "./css/RecipePage.css";
import Axios from "axios";
import JSShare from "js-share";

const RecipePanel = (props) => {
    const { id } = useParams();
    const [inBookMark, setInBookMark] = useState(false);
    const [recipe, setRecipe] = useState({
        name: "",
        image: "",
        instruction: "",
        ingradient: [],
        rating: "",
        tags:[]
    });

    useEffect(() => {
        const fetchData = async () => {
            Axios.get(`/recipe/${id}`).then((response) => {
                console.log(response.data);
                setRecipe({
                    name: response.data.name,
                    image: response.data.image,
                    instruction: response.data.instruction,
                    ingradient: response.data.ingredients,
                    rating: response.data.rating,
                    tags: response.data.tags
                });
            });
        };
        fetchData();

        fetch(`http://localhost:5000/dashboard/notinbookmark/${id}`, {
            method: "POST",
            credentials: "include",
        })
            .then((res) => {
                //console.log(res.ok);
                if (res.ok) {
                    setInBookMark(false);
                    setMessage("BookMark");
                } else {
                    setInBookMark(true);
                    setMessage("UnBookMark");
                }
            })
            .then((result) => console.log(result));

        /**
         *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
         *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
        /*
        var disqus_config = function () {
        this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
        */
        (function () {
            // DON'T EDIT BELOW THIS LINE
            var d = document,
                s = d.createElement("script");
            s.src = "https://so-yummy.disqus.com/embed.js";
            s.setAttribute("data-timestamp", +new Date());
            (d.head || d.body).appendChild(s);
        })();

        var shareItems = document.querySelectorAll(".social_share");
        JSShare.options.url = window.location.href;
        for (var i = 0; i < shareItems.length; i += 1) {
            shareItems[i].addEventListener("click", function share(e) {
                return JSShare.go(this);
            });
        }
    }, [id, inBookMark]);
    const ins = recipe.instruction.split("\\r\\n");
    var ing_list = [];
    ////console.log(recipe.ingradient[0]);
    for (var i = 0; i < recipe.ingradient.length; i++) {
        var value = "";
        for (var key in recipe.ingradient[i]) {
            //console.log(key, recipe.ingradient[i][key]);
            value = value + recipe.ingradient[i][key] + "  ";
            //console.log("finished concate");
            //console.log(value);
        }
        ing_list.push(value);
    }
    console.log(ing_list);
    //console.log(recipe.ingradient[0].ingredient)
    //const ingradient_list = recipe.ingradient.map((list) => <li>{list}</li>);
    const steps = ins.map((step) => <li>{step}</li>);
    const ing_steps = ing_list.map((step1) => <li>{step1}</li>);
    const tag_list = recipe.tags.map((ele) => <Badge className="mr-2" color="secondary">{ele}</Badge>)
    const [message, setMessage] = useState("Bookmark");

    function Star({ marked, starId }) {
        return (
          <span star-id={starId} style={{ color: "#ff9933" }} role="button">
            {/* 空星，实星 */}
            {marked ? "\u2605" : "\u2606"}
          </span>
        );
      }
    
      function StarRating(props) {
        // 分数显示
        const [rating, setRating] = React.useState(
          typeof props.rating == "number" ? props.rating : 0
        );
        // 鼠标移入效果
        const [selection, setSelection] = React.useState(0);
        const hoverOver = event => {
          let val = 0;
          if (event && event.target && event.target.getAttribute("star-id"))
            val = event.target.getAttribute("star-id");
          setSelection(val);
        };
        return (
          <div
            // 鼠标移入效果
            onMouseOut={() => hoverOver(null)}
            // 点击选中分数
            onClick={event =>
              setRating(event.target.getAttribute("star-id") || rating)
            }
            onMouseOver={hoverOver}
          >
            {/* 创建5个组件 */}
            {Array.from({ length: 5 }, (v, i) => (
              <Star
                starId={i + 1}
                key={`star_${i + 1} `}
                marked={selection ? selection >= i + 1 : rating >= i + 1}
              />
            ))}
          </div>
        );
      }


    return (
        <Container className="mt-2">
            <Row>
                <Col sm="12" md={{ size: 8, offset: 2 }}>
                    <Card className="mb-2">
                        <CardImg
                            className="recipe-img"
                            top
                            width="100%"
                            src={recipe.image}
                            alt="Card image cap"
                        />
                        <div className="share-wrap">
                            <Button color="link" size="sm" className="mr-2">
                                <svg
                                    t="1593013818062"
                                    className="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="2217"
                                    width="24"
                                    height="24"
                                >
                                    <path
                                        d="M1010.8 628c0-141.2-141.3-256.2-299.9-256.2-168 0-300.3 115.1-300.3 256.2 0 141.4 132.3 256.2 300.3 256.2 35.2 0 70.7-8.9 106-17.7l96.8 53-26.6-88.2c70.9-53.2 123.7-123.7 123.7-203.3zM618 588.8c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40c0 22-17.9 40-40 40z m194.3-0.3c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z"
                                        fill="#00C800"
                                        p-id="2218"
                                    ></path>
                                    <path
                                        d="M366.3 106.9c-194.1 0-353.1 132.3-353.1 300.3 0 97 52.9 176.6 141.3 238.4l-35.3 106.2 123.4-61.9c44.2 8.7 79.6 17.7 123.7 17.7 11.1 0 22.1-0.5 33-1.4-6.9-23.6-10.9-48.3-10.9-74 0-154.3 132.5-279.5 300.2-279.5 11.5 0 22.8 0.8 34 2.1C692 212.6 539.9 106.9 366.3 106.9zM247.7 349.2c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z m246.6 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z"
                                        fill="#00C800"
                                        p-id="2219"
                                    ></path>
                                </svg>
                            </Button>
                            <Button color="link" size="sm" className="mr-2">
                                <svg
                                    t="1593014357015"
                                    className="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="2217"
                                    width="24"
                                    height="24"
                                >
                                    <path
                                        d="M967.601349 1024c31.076808 0 56.398651-25.321843 56.398651-56.398651V56.398651c0-31.076808-25.321843-56.398651-56.398651-56.398651H56.398651C25.321843 0 0 25.321843 0 56.398651v910.819034c0 31.076808 25.321843 56.398651 56.398651 56.398651h911.202698z"
                                        fill="#3C5A99"
                                        p-id="3229"
                                    ></path>
                                    <path
                                        d="M706.709629 1024V627.29112h133.13151l19.950543-154.61671h-153.082053V374.072686c0-44.888722 12.277257-75.198202 76.732859-75.198201h81.720494v-138.119146c-14.195579-1.918321-62.920944-6.138629-119.319595-6.138629-118.168602 0-198.738104 72.128887-198.738104 204.109405v113.948295h-133.515174v154.61671h133.515174v396.70888h159.604346z"
                                        fill="#FFFFFF"
                                        p-id="3230"
                                    ></path>
                                </svg>
                            </Button>
                            <Button color="link" size="sm" className="mr-2">
                                <svg
                                    t="1593014410118"
                                    className="icon"
                                    viewBox="0 0 1031 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="2217"
                                    width="24"
                                    height="24"
                                >
                                    <path
                                        d="M0 0z m790.037 519.76c0 149.27-121.04 270.277-270.276 270.277-149.269 0-270.276-121.007-270.276-270.276a266.31 266.31 0 0 1 5.1-51.976H72.767v359.252c0 77.12 62.468 139.718 139.718 139.718h614.552c77.12 0 139.718-62.533 139.718-139.718V467.785H785.001a271.41 271.41 0 0 1 5.036 51.976z m37-446.993H212.485c-77.185 0-139.718 62.566-139.718 139.718v151.348h226.29c48.923-69.129 129.518-114.348 220.704-114.348s171.78 45.22 220.703 114.348h226.291V212.485c0-77.12-62.566-139.718-139.718-139.718z m68.349 172.56c0 13.774-11.24 24.949-24.949 24.949h-74.78c-13.71 0-24.95-11.24-24.95-24.949v-74.845c0-13.774 11.273-24.949 24.95-24.949h74.78c13.774 0 24.949 11.24 24.949 24.949v74.845zM686.084 519.761c0-91.9-74.488-166.324-166.323-166.324s-166.324 74.424-166.324 166.324 74.489 166.323 166.324 166.323 166.323-74.423 166.323-166.323z"
                                        fill="#CF2F79"
                                        p-id="4145"
                                    ></path>
                                </svg>
                            </Button>
                        </div>
                        <CardBody>
                            <CardTitle>{recipe.name}</CardTitle>
                            <dl className="info-item">
                                <dt>tags</dt>
                                <dd>
                                    <Badge className="mr-2" color="secondary">
                                       {tag_list}
                                    </Badge>
                                    
                                </dd>
                            </dl>
                            <dl className="info-item my-2">
                                <dt>Ingredients</dt>
                                <dd>
                                    <ol className="ml-0 pl-4">
                                        <ur>{ing_steps}</ur>
                                    </ol>
                                </dd>
                            </dl>
                            <dl className="info-item my-2">
                                <dt>instruction</dt>
                                <dd>
                                    <ol className="ml-0 pl-4">
                                        <ur>{steps}</ur>
                                    </ol>
                                </dd>
                            </dl>
                            <dl className="info-item my-2">
                                <dt>Rating</dt>
                                <dd>
                                    
                                <StarRating rating={recipe.rating} />

                                </dd>
                            </dl>
                            <dl className="info-item my-2">
                                <dt>Shop In Coles</dt>
                                <dd>
                                    <a href="https://www.coles.com.au/">
                                        www.coles.com/au
                                    </a>
                                </dd>
                            </dl>
                            <Button
                                onClick={() => {
                                    if (!inBookMark) {
                                        fetch(
                                            `http://localhost:5000/dashboard/bookmark/${id}`,
                                            {
                                                method: "POST",
                                                credentials: "include",
                                            }
                                        )
                                            .then((res) => res.json())
                                            .then((result) =>
                                                console.log(result)
                                            );
                                    } else {
                                        fetch(
                                            `http://localhost:5000/dashboard/bookmark/${id}`,
                                            {
                                                method: "DELETE",
                                                credentials: "include",
                                            }
                                        )
                                            .then((res) => res.json())
                                            .then((result) =>
                                                console.log(result)
                                            );
                                    }
                                    setInBookMark(!inBookMark);
                                }}
                            >
                                {message}
                            </Button>
                            <div className={"share-container"}>
                                <div className={"share-text"}>Share to:</div>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="fb"
                                >
                                    Facebook
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="twitter"
                                >
                                    Twitter
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="vk"
                                >
                                    VK.com
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="ok"
                                >
                                    OK.ru
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="mailru"
                                >
                                    Mail.Ru
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="gplus"
                                >
                                    Google+
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="googlebookmarks"
                                >
                                    Google Bookmarks
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="livejournal"
                                >
                                    LiveJournal
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="tumblr"
                                >
                                    Tumblr
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="pinterest"
                                >
                                    Pinterest
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="linkedin"
                                >
                                    LinkedIn
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="reddit"
                                >
                                    Reddit
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="mailru"
                                >
                                    Mail.ru
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="weibo"
                                >
                                    Weibo
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="line"
                                >
                                    Line.me
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="skype"
                                >
                                    Skype
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="telegram"
                                >
                                    Telegram
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="whatsapp"
                                >
                                    Whatsapp
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="viber"
                                >
                                    Viber
                                </button>
                                <button
                                    className="btn btn-default social_share"
                                    data-type="email"
                                >
                                    Email
                                </button>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="mb-2">
                        <div id="disqus_thread"></div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RecipePanel;
