var ABC = 896;
var COLS = 32;
var ABCS = ABC + COLS;
var MODIFIER_0 = ABC+25;
var MODIFIER_1 = ABC+26;

var CYRABC = ABC+COLS*2+15;
var CYRABCS = CYRABC + COLS;

function get_glyph(char){
    let g = glyphs[char];
    if (typeof g === 'undefined')
        return null;
    return g;
}

function get_glyph_modifier(char){
    let g = modifiers[char];
    if (typeof g === 'undefined')
        return null;
    return g;
}

function is_glyph_nospace(char){
    return ',.:!?;il'.includes(char);
}

var modifiers = {
    'ё': MODIFIER_0,
    'й': MODIFIER_1,
};

var glyphs = {
    'A': ABC,
    'B': ABC+1,
    'C': ABC+2,
    'D': ABC+3,
    'E': ABC+4,
    'F': ABC+5,
    'G': ABC+6,
    'H': ABC+7,
    'I': ABC+8,
    'J': ABC+9,
    'K': ABC+10,
    'L': ABC+11,
    'M': ABC+12,
    'N': ABCS+28,
    'O': ABC+13,
    'P': ABC+14,
    'Q': ABC+15,
    'R': ABC+16,
    'S': ABC+17,
    'T': ABC+18,
    'U': ABC+19,
    'V': ABC+20,
    'W': ABC+21,
    'X': ABC+22,
    'Y': ABC+23,
    'Z': ABC+24,
    
    '!': ABC+27,
    ',': ABC+28,
    '.': ABC+29,
    ':': ABC+30,
    '?': ABC+31,
    ';': ABCS+26,
    
    'a': ABCS,
    'b': ABCS+1,
    'c': ABCS+2,
    'd': ABCS+3,
    'e': ABCS+4,
    'f': ABCS+5,
    'g': ABCS+6,
    'h': ABCS+7,
    'i': ABCS+8,
    'j': ABCS+9,
    'k': ABCS+10,
    'l': ABCS+11,
    'm': ABCS+12,
    'n': ABCS+29,
    'o': ABCS+13,
    'p': ABCS+14,
    'q': ABCS+15,
    'r': ABCS+16,
    's': ABCS+17,
    't': ABCS+18,
    'u': ABCS+19,
    'v': ABCS+20,
    'w': ABCS+21,
    'x': ABCS+22,
    'y': ABCS+23,
    'z': ABCS+24,
    
    'А': ABC,
    'Б': CYRABC,
    'В': ABC+1,
    'Г': CYRABC+1,
    'Д': CYRABC+2,
    'Е': ABC+4,
    'Ё': ABC+4,
    'Ж': CYRABC+3,
    'З': CYRABC+4,
    'И': ABCS+27,
    'Й': ABCS+27,
    'К': ABC+10,
    'Л': CYRABC+5,
    'М': ABC+12,
    'Н': ABC+7,
    'О': ABC+14,
    'П': CYRABC+6,
    'Р': ABC+15,
    'С': ABC+2,
    'Т': ABC+18,
    'У': ABC+24,
    'Ф': CYRABC+7,
    'Х': ABC+23,
    'Ц': CYRABC+8,
    'Ч': CYRABC+9,
    'Щ': CYRABC+10,
    'Ь': CYRABC+11,
    'Ы': CYRABC+12,
    'Ъ': CYRABC+13,
    'Э': CYRABC+14,
    'Ю': CYRABC+15,
    'Я': CYRABC+16,

    'а': ABCS,
    'б': CYRABCS,
    'в': ABCS+31,
    'г': CYRABCS+1,
    'д': CYRABCS+2,
    'е': ABCS+4,
    'ё': ABCS+4,
    'ж': CYRABCS+3,
    'з': CYRABCS+4,
    'и': ABCS+27,
    'й': ABCS+27,
    'к': ABCS+10,
    'л': CYRABCS+5,
    'м': ABCS+12,
    'н': CYRABC-1,
    'о': ABCS+13,
    'п': CYRABCS+6,
    'р': ABCS+14,
    'с': ABCS+2,
    'т': ABCS+30,
    'у': ABCS+23,
    'ф': CYRABCS+7,
    'х': ABCS+22,
    'ц': CYRABCS+8,
    'ч': CYRABCS+9,
    'щ': CYRABCS+10,
    'ь': CYRABCS+11,
    'ы': CYRABCS+12,
    'ъ': CYRABCS+13,
    'э': CYRABCS+14,
    'ю': CYRABCS+15,
    'я': CYRABCS+16
};
