import { Gtk } from "ags/gtk4";

export function RevealerBtn(): Gtk.Widget {
    return (<revealer
      transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
      transitionDuration={300}
      revealChild={true}
      
    >
      <button
        
        cssName="bar-music-btn"
        onClicked={() => console.log('clicked')}
        label="hola mundo">
        
      </button>
    </revealer>) as any;
}