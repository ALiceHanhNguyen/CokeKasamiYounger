var COLOR_NORMAL_CELL   = "#000000"; // trắng
var COLOR_ACTIVE_CELL   = "#EE1700";
var COLOR_TEST_CELL     = "#FFCB05";
var COLOR_MATCH_CELL    = "#00B251";
var COLOR_UPDATE_CELL   = "#393E46"; // hồng

var UPDATE_INTERVAL = 300;
var _update_actions = new Array();
var _update_action_idx = 0;

var _active_cell = [-1,-1];
var _context_cells = [-1,-1,-1,-1];

var _update_timer_id = -1;

var _is_animation_running = false;


function paint_cell(i, j, color) {
  var cell = entry2cell(i, j);
  cell.bgColor = color;
}

function dump_object(o) {
  var s = "";
  for (var p in o) { s += p + ":" + o[p] + ";  "; }
  alert(s);
}

function update_ui() {
  if (_update_action_idx == _update_actions.length) {
    clearInterval(_update_timer_id);
    _update_action_idx = 0;
    _is_animation_running = false;
    window.status = "Animation done. Click on the chart to restart";
    return;
  }
  var action = _update_actions[_update_action_idx++];
  if (action == "--")
    return; // sleep for a while
  eval(action);
}

function set_entry_content(i, j, content) {
  var cell = entry2cell(i, j);
  cell.innerHTML = content;
}

function entry2cell(i, j) {
  return tchart.rows.item(tchart.rows.length - 1 - i).cells.item(j);
}

function do_parse() {
  var cky_event_handler = new Object();

  cky_event_handler.start = function(s) {
    create_chart(s);
    set_sentence(s);
    cky_output.style.display = "block";
    cky_output.focus();
  }

  cky_event_handler.end = function(accepted) {
    var s = "paint_cell("+_context_cells[0]+","+_context_cells[1]+",COLOR_NORMAL_CELL);";
    s += "paint_cell("+_context_cells[2]+","+_context_cells[3]+",COLOR_NORMAL_CELL);";
    s += "paint_cell("+_active_cell[0]+","+_active_cell[1]+",COLOR_NORMAL_CELL);";

    _update_actions.push(s);
    _update_action_idx = 0;

    pause_resume_animation();
  }

  cky_event_handler.cell_updated = function(i, j, content) {
    _update_actions.push("paint_cell("+i+","+j+",COLOR_ACTIVE_CELL);" +
      "set_entry_content("+i+","+j+",\""+content +"\");");
    _update_actions.push("--");
    _update_actions.push("--");
    _update_actions.push("--");
    _update_actions.push("--");
  }

  cky_event_handler.active_cell_changed = function(i, j) {
    var s = "";
    if (_context_cells[0] != -1) {
      s += "paint_cell("+_context_cells[0]+","+_context_cells[1]+",COLOR_NORMAL_CELL);";
      s += "paint_cell("+_context_cells[2]+","+_context_cells[3]+",COLOR_NORMAL_CELL);";
    }
    if (_active_cell[0] != -1) {
      s += "paint_cell("+_active_cell[0]+","+_active_cell[1]+",COLOR_NORMAL_CELL);";
    }
    s += "paint_cell("+i+","+j+",COLOR_ACTIVE_CELL);";
    _active_cell[0] = i;
    _active_cell[1] = j;
    _update_actions.push(s);
  }

  cky_event_handler.attempt_match = function(i, j, k, l) {
    var s = "";
    if (_context_cells[0] != -1) {
      s += "paint_cell("+_context_cells[0]+","+_context_cells[1]+",COLOR_NORMAL_CELL);";
      s += "paint_cell("+_context_cells[2]+","+_context_cells[3]+",COLOR_NORMAL_CELL);";
    }
    s += "paint_cell("+i+","+j+",COLOR_TEST_CELL);";
    s += "paint_cell("+k+","+l+",COLOR_TEST_CELL);";
    _update_actions.push(s);
    _context_cells[0] = i;
    _context_cells[1] = j;
    _context_cells[2] = k;
    _context_cells[3] = l;
  }

  cky_event_handler.found_match = function(i, j, k, l) {
    var s = "";
    s += "paint_cell("+i+","+j+",COLOR_MATCH_CELL);";
    s += "paint_cell("+k+","+l+",COLOR_MATCH_CELL);";
    s += "paint_cell("+_active_cell[0]+","+_active_cell[1]+",COLOR_MATCH_CELL);";
    _update_actions.push(s);
    _update_actions.push("--");
    _update_actions.push("--");
  }

  try {
    cky_offline(idgram.value, idsen.value, cky_event_handler);
  }
  catch (e) {
    alert(e);
    return;
  }
}

function create_chart(s) {
  var n = s.length;
  var tb = tchart.firstChild;
  if (tb == null || typeof(tb) == 'undefined') {
    tb = document.createElement("TBODY");
    tchart.appendChild(tb);
  }

  for (var i = 0; i <n; ++i) {
    var row = document.createElement("TR");
    tb.appendChild(row);
    for (var j = 0; j < n; ++j) {
      var cell = document.createElement("TD");
      row.appendChild(cell);
      cell.setAttribute("width", (1 / n) * 100.00 + "%");
      cell.setAttribute("align", "center");
      cell.setAttribute("bgColor", COLOR_NORMAL_CELL);
      cell.setAttribute("style", "font-weight: 600; color: white");
      cell.innerHTML = "&nbsp;";
    }
  }
}

function set_sentence(s) {
  var n = s.length;

  // Add column number
  var rt = rowsCount.firstChild;
  rt = document.createElement("TBODY");
  rowsCount.appendChild(rt);
  var row1 = document.createElement("TR");
  rt.appendChild(row1);
  for (var j = 0; j < n; ++j) {
    var cell = document.createElement("TD");
    row1.appendChild(cell);
    cell.setAttribute("width", (1 / n) * 100.00 + "%");
    cell.setAttribute("align", "center");
    cell.setAttribute("style", "font-weight: 600;font-size: 16px;text-align: center;background: #fa6291;height: 35px;");
    cell.innerHTML = j+1;
  }

  // Add Row count
  ct = rowsCount.firstChild;
  ct = document.createElement("TBODY");
  columnsCount.appendChild(ct);
  for (var i = 0; i <= n; ++i) {
    var row = document.createElement("TR");
    ct.appendChild(row);
    for (var j = 0; j < 1; ++j) {
      var cell = document.createElement("TD");
      row.appendChild(cell);
      cell.setAttribute("width", (1 / n) * 100.00 + "%");
      cell.setAttribute("align", "buttom");
      cell.setAttribute("style", "font-weight: 600; font-size: 16px; text-align: center;background: #fa6291;");
      cell.innerHTML = i-1;
      if(cell.innerHTML == -1 )
      {
        cell.innerHTML = 0;
        cell.setAttribute("style", "font-weight: 600; font-size: 16px; text-align: center; padding-top: 35px; background: #fa6291;");
      }
    }
  }

// Add Text
  var tb = tsentence.firstChild;
  if (tb == null || typeof(tb) == 'undefined') {
    tb = document.createElement("TBODY");
    tsentence.appendChild(tb);
  }
  var row = document.createElement("TR");
  tb.appendChild(row);
  for (var i = 0; i < n; ++i) {
    var cell = document.createElement("TD");
    row.appendChild(cell);
    cell.setAttribute("width", (1 / n) * 100.00 + "%");
    cell.setAttribute("align", "center");
    cell.setAttribute("style", "font-weight: 600; font-size: 16px; text-align: center; background: #00B251;height: 40px; text-transform: uppercase; color: yellow");
    cell.innerHTML = s[i];
  }
}

function delete_chart() {
  cky_output.style.display = "none";

  clearInterval(_update_timer_id);
  _update_actions = new Array();

  tchart.removeChild(tchart.firstChild);
  tsentence.removeChild(tsentence.firstChild);
  rowCount.removeChild(rowsCount.firstChild);
}

function clear_chart() {
  var cells = tchart.getElementsByTagName("TD");
  for (var i = 0; i < cells.length; ++i) {
    cells[i].innerHTML = "&nbsp;";
  }
}

function pause_resume_animation() {
  if (_is_animation_running) {
    clearInterval(_update_timer_id);
    window.status = "Animation paused. Click on the chart to resume";
  }
  else {
    if (_update_action_idx == 0)
      clear_chart();
    _update_timer_id = setInterval("update_ui()", UPDATE_INTERVAL);
    window.status = "Animation running. Click on the chart to pause";
  }
  _is_animation_running = !_is_animation_running;
}

function chart_key_handler(event) {
  switch (event.keyCode) {
    case 0x0D:  // enter
    case 0x20:  // space
      pause_resume_animation();
      break;
    case 0x1B: // escape
      delete_chart();
      window.status = "";
      _is_animation_running = false;
      clearInterval(_update_timer_id);
      break;
    default:
      return false; // give the other handlers chance to process the event
  }
  return true;
}
