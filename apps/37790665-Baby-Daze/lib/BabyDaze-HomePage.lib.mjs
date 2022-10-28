import {
    PWA,
    Page,
    Div
} from 'https://gcode.com.au/modules/pwa.mjs';
import {Text,Center,Container,ListView,ListTile,Icon,Icons,Video,Form,TextFormField,DateFormField,InputDecoration,Padding,Column} from './flutter-widgets.lib.mjs';

export class HomePage extends Page {
    constructor() {
        super({
            "id": "HomePage",
            "color": "#545454",
            "backgroundColor": "#FAEBF2",
            "hideFloatingActionButton": "true",
            "hideFooter": "true",
            "child": new ListView({
                "id": "myListView",
                "padding": "8px",
                "children": [
                    new ListTile({
                        "color": "red",
                        "title": new Text("34 min ago"),
                        "subtitle": new Text("Nursing paused."),
                        "leading": new Icon(Icons.battery_full),
                        "trailing": new Icon(Icons.alarm),
                        "onclick": () => PWA.getPWA().setPage("Nursing")
                    }),
                    new ListTile({
                        "color": "blue",
                        "title": new Text("17 hours 34 min ago"),
                        "subtitle": new Text("Subtitle: The battery is full."),
                        "leading": new Icon(Icons.flag),
                        "trailing": new Icon(Icons.alarm),
                        "onclick": () => PWA.getPWA().setPage("SomeOtherPage1")
                    }),
                    new ListTile({
                        "color": "green",
                        "title": new Text("Sleep"),
                        "subtitle": new Text("Subtitle: The battery is full."),
                        "leading": new Icon(Icons.battery_full),
                        "trailing": new Icon(Icons.alarm),
                        "onclick": () => PWA.getPWA().setPage("SomeOtherPage2")
                    }),
                    new ListTile({
                        title: new Text("18 hours 20 min ago"),
                        subtitle: new Text("Subtitle: The battery is full."),
                        leading: new Icon(Icons.battery_full),
                        trailing: new Icon(Icons.star_outline),
                        onclick: () => PWA.getPWA().setPage("SomeOtherPage3")
                    }),
                    new ListTile({
                        color: "#2222FF",
                        title: new Text("17 hours 19 min ago"),
                        subtitle: new Text("Subtitle: The battery is full."),
                        leading: new Icon(Icons.battery_full),
                        trailing: new Icon(Icons.star_outline),
                        onclick: () => PWA.getPWA().setPage("SomeOtherPage4")
                    }),
                    new ListTile({
                        color: "#FF3333",
                        title: new Text("18 hours 20 min ago"),
                        subtitle: new Text("Video Blog"),
                        leading: new Icon(Icons.battery_full),
                        trailing: new Icon(Icons.star_outline),
                        onclick: () => PWA.getPWA().setPage("VideoBlog")
                    }),
                ],
            })

        });
    }

}