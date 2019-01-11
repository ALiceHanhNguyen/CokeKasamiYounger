var data = {
  "status": "success",
  "data": [
    {
      "Id": 1,
      "CNF": "S -> NP VP\r\nNP -> toi\r\nNP -> NN NP\r\nNP -> NN PP\r\nNP -> minh\r\nVP -> VB NP\r\nPP -> IN NP\r\nVB -> co\r\nIN -> ben\r\nNN -> hoa\r\nNN -> be\r\nNN -> ban"
    },
    {
      "Id": 2,
      "CNF": "S -> NP VP\r\nNP -> hoa\r\nNP -> DT NP\r\nNP -> NN NP\r\nNP -> Q NP\r\nNP -> NN VP\r\nVP -> VB NP\r\nVP -> ADV VP\r\nVP -> noi\r\nVB -> hieu\r\nDT -> ca\r\nQ -> nhung\r\nADV -> chang\r\nNN -> dieu\r\nNN -> toi"
    },
    {
      "Id": 3,
      "CNF": "S -> NP VP\r\nNP -> NN NP\r\nNP -> vi\r\nNP -> Q NP\r\nNP -> NN ADJ\r\nVP -> VB NP\r\nVB -> cua\r\nQ -> nhung\r\nADJ -> xua\r\nNN -> hoa\r\nNN -> tuong\r\nNN -> ngay"
    },
    {
      "Id": 4,
      "CNF": "S -> NP VP\r\nNP -> toi\r\nNP -> Q NP\r\nNP -> NN NP\r\nNP -> NN ADJ\r\nVP -> ADV VP\r\nVP -> VB NP\r\nADJ -> JJ JJ\r\nADV -> van\r\nVB -> nho\r\nQ -> mot\r\nJJ -> phieu\r\nJJ -> lang\r\nNN -> mau\r\nNN -> may"
    },
    {
      "Id": 5,
      "CNF": "S -> NP VP\r\nNP -> NN NP\r\nNP -> ai\r\nNP -> la\r\nVP -> VB PP\r\nPP -> IN NP\r\nVB -> goi\r\nIN -> sau\r\nNN -> ten\r\nNN -> minh\r\nNN -> vom"
    },
    {
      "Id": 6,
      "CNF": "S -> NP VP\r\nNP -> Q NP\r\nNP -> NN NP\r\nNP -> trai\r\nNP -> muoi\r\nVP -> VB NP\r\nVB -> dang\r\nQ -> nhung\r\nQ -> hai\r\nNN -> chang\r\nNN -> do\r\nNN -> tuoi"
    },
    {
      "Id": 7,
      "CNF": "S -> NP VP\r\nNP -> nguoi\r\nNP -> NN VP\r\nNP -> NN NP\r\nNP -> dai\r\nVP -> VB NP\r\nVB -> yeu\r\nNN -> nguoi\r\nNN -> hoa\r\nNN -> co\r\nNN -> dat"
    },
    {
      "Id": 8,
      "CNF": "S -> NP VP\r\nNP -> Q NP\r\nNP -> NN NP\r\nNP -> chuyen\r\nNP -> qua\r\nNP -> NN VP\r\nVP -> VB ADJ\r\nVP -> VB NP\r\nADJ -> JJ NP\r\nQ -> nhung\r\nJJ -> quanh\r\nVB -> hai\r\nVB -> xoay\r\nNN -> cau\r\nNN -> mua"
    },
    {
      "Id": 9,
      "CNF": "S -> NP VP\r\nNP -> Q NP\r\nNP -> NN NP\r\nNP -> NN ADJ\r\nNP -> IN NP\r\nNP -> xa\r\nVP -> VB NP\r\nQ -> mot\r\nADJ -> lang\r\nVB -> chay\r\nIN -> tu\r\nNN -> dong\r\nNN -> song"
    },
    {
      "Id": 10,
      "CNF": "S -> NP VP\r\nNP -> NN NP\r\nNP -> suong\r\nNP -> so\r\nVP -> VB ADV\r\nADV -> JJ NP\r\nVB -> bay\r\nJJ -> day\r\nNN -> thung\r\nNN -> lung\r\nNN -> vang\r\nNN -> cua"
    }
  ]
}

function array_index_of(a, e) {
    if (a != null) {
      for (var i = 0; i < a.length; ++i) {
        if (a[i] == e)
          return i;
      }
    }
    return -1;
  }

function merge_arrays(a, b) {
  for (var i = 0; i < b.length; ++i) {
    a.push(b[i]);
  }
}

function Grammar(grammar) {
  this._terminal_rules = new Array();
  this._non_terminal_rules = new Array();

  var re_rule = /^(\w+)\s*->\s*(\w+)(?:\s+(\w+))?\s*\.?$/;
  grammar = grammar.split(/\r?\n/);

  for (var i = 0; i < grammar.length; ++i) {
    var r = grammar[i];
    if (r.length == 0)
      continue;
    console.log('######', r);
    var a = re_rule.exec(r);
    console.log('1######', a);
    if (a == null)
      throw "bad rule syntax: " + r;

    if (a[3]) {
      var new_rule = new Array(a[1], a[2], a[3]);
      this._non_terminal_rules.push(new_rule);
      if (this._s == null)
        this._s = new String(a[1]);
    }
    else
    {
      var new_rule = new Array(a[1], a[2]);
      this._terminal_rules.push(new_rule);
    }
  }

  this.start_symbol = function() { return this._s; }

  this.left_hand_sides = function(s) {
    var res = new Array();
    for (var i = 0; i < this._terminal_rules.length; ++i) {
      var r = this._terminal_rules[i];
      if (r[1] == s)
        res.push(r[0]);
    }
    return res;
  }

  this.left_hand_sides2 = function(s, t) {
    var res = new Array();
    for (var i = 0; i < this._non_terminal_rules.length; ++i) {
      var r = this._non_terminal_rules[i];
      if (r[1] == s && r[2] == t)
        res.push(r[0]);
    }
    return res;
  }

  return this;
}

function tokenize_sentence(sentence) {
  var s = sentence.split(/\s+/);
  return s;
}

function allocate_chart(N) {
  var c = new Array(N + 1);
  c[0] = new Array(N);
  for (var i = 1; i <= N; ++i) {
    c[i] = new Array(N - (i - 1));
  }
  return c;
}

function cky_offline(grammar, sentence, eh) {
  var G = new Grammar(grammar);
  var S = tokenize_sentence(sentence);
  var N = S.length;
  var C = allocate_chart(N);

  eh.start(S);
  for (var x = N-1; x >=0 ; --x) {
    var y = N-x-1;
    eh.active_cell_changed(x, y);
    C[x][y] = G.left_hand_sides(S[y]);
    eh.cell_updated(x, y, C[x][y]);

  }
  for (var x = 1; x < N; ++x) {
    for (var y = x-1; y >=0 ; --y) {
      var nt = C[N-1-y][x];

      eh.active_cell_changed(N-1-y, x);

      for (var i = x; i > y; --i ) { // chay theo dong

            var nts2 = C[N-1-i][x];
            var nts1 = C[N-1-y][i -1];

                eh.attempt_match(N-1-i,x,N-1-y,i-1);
                if (nts1 != null && nts2 != null) {
                  for (var ii = 0; ii < nts1.length; ++ii) {
                    var nt1 = nts1[ii];
                    for (var jj = 0; jj < nts2.length; ++jj) {
                      var nt2 = nts2[jj];
                      var rhss = G.left_hand_sides2(nt1, nt2);
                      if (rhss == 0 || rhss.length == 0)
                        continue;
                      if (nt == null) {
                        nt = new Array();
                        C[N-1-y][x] = nt;
                      }
                      merge_arrays(nt, rhss);
                      eh.found_match(N-1-i,x,N-1-y,i-1);
                      eh.cell_updated(N-1-y, x, nt);
                    }
                  }
                }

        }
    }
  }

  var accepted = array_index_of(C[N - 1][0], G.start_symbol()) != -1;
  eh.end(accepted);
  return accepted;
}

function choosen_sentence(value, id) {
  idsen.value = value;
  var result = data.data.find(i => i.Id === id);
  idgram.value = result ? result.CNF : '';
}