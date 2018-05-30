module.exports = `
Sound {
  Line = Graph | Play | Comment

  /*
    A comment is any line that begins with #
  */

  Comment = "#" any+

  /*
    SOUND OBJECTS
    A sound object is a '@synth' variable. We
    can also access part of the sound's graph
    using dot notation, e.g. '@synth.osc1'.
    We'll only accept soundAccessors in a few
    places.
  */

  sound = "@" alnum+
  propertyAccessor = "." alnum+
  soundAccessor = sound propertyAccessor?
  soundArgument = alnum+ -- number
    | float -- float

  /*
    GRAPH LINES
    A graph is a sound declaration followed by
    one or more pipes that configure it. Graph
    declarations will be additive, e.g. two
    line with '@synth ~ osc()' will create two
    oscillators. No overwriting for v1.
  */

  Graph = soundAccessor Pipe?

  /*
    Sound blocks look like functions, e.g.
    'osc(sine, 1)'. You can string several
    together using pipes, which will literally
    pipe the sounds together.
  */

  SoundBlock = letter+ "(" listOf<soundArgument, delimiter> ")" name?
  name = ":" alnum+

  Pipe = ("~" SoundBlock)+

  /*
    PLAY LINES
    A play line is a play keyword (either 'play'
    or '>'), followed by the sound we want to play,
    followed by a pattern. Each pattern uses a
    different enclosing bracket. They could also
    use a SoundBlock-like definition I guess.
  */

  Play = PlayKeyword sound Pattern
  PlayKeyword = "play" | ">"

  /*
    PATTERNS
    These are pretty straightforward, they are
    lists of characters with delimiters.
  */

  Pattern = listOf<RhythmDeclaration, delimiter>
  RhythmDeclaration = DrumPattern
    | NotePattern
    | TimePattern
  DrumPattern = "|" letter+ "|"
  NotePattern = "{" listOf<note, delimiter> "}"
  TimePattern = "[" listOf<float, delimiter> "]"

  /*
    MISC nitty gritty stuff
  */

  delimiter = ", " | "," | " "
  float = digit "." digit+ -- fullFloat
    | digit "." -- dot
    | "." digit+ -- dotStart
    | digit -- noDot
  note = alnum+
}
`;