# Design
Theme {
	id integer pk
	bg integer > Background.id
	msg_sender_color string
	msg_other_color string
	author integer *> User.id
}

Emoji {
    collection integer *> EmojiCollection.id
	id integer pk
	img_url string
	author integer >* User.id
}

EmojiCollection {
	id integer pk
	name string
	author integer > User.id
}

Background {
	id integer pk
	type integer > BackgroundTypes.id
	single_img_url string
	single_color string
}

BackgroundTypes {
	id integer pk
	name string
}

ParallaxImage {
	id integer pk
	img_url string
	speed int
}

BackgroundParallax {
	bg_id integer > Background.id
	parallax_img_id integer > ParallaxImage.id
}



User {
	id integer pk
	name string
	theme integer
} 

### NOSQL 
Theme{  
  name: string 
  sender_msg_color:string
  other_msg_color:string
  author:id
  bg: {   
    divider: { 
      max_height,
      height, 
      color,
    } 
    layers: {
    {img_url,speed, translateYMin, translateYMax, margin}
    {img_url,speed, translateYMin, translateYMax, margin}
    {img_url,speed, translateYMin, translateYMax, margin}
    {img_url,speed, translateYMin, translateYMax, margin}
        }  

  }, 
} 

Message { 
	from: "id"  
	to: "id"  # this id can be either group or user id
}



# Decision notes
User can create many emojis, add them to many collections or use them individually, it's like a tagging system   

Background 1-many ParallaxImages
need Background to query ParallaxImages faster 
-> Map table
