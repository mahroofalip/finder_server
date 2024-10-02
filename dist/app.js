"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const AppError_1 = __importDefault(require("./utils/AppError"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware setup
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '500mb' })); // Set limit here
app.use(express_1.default.urlencoded({ limit: '500mb', extended: true })); // Set limit here
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Routes
const routes_1 = __importDefault(require("./routes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const sideMenuRoutes_1 = __importDefault(require("./routes/sideMenuRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const mapRoutes_1 = __importDefault(require("./routes/mapRoutes"));
const commonRoutes_1 = __importDefault(require("./routes/commonRoutes"));
const likeRoutes_1 = __importDefault(require("./routes/likeRoutes"));
const ignoreRoutes_1 = __importDefault(require("./routes/ignoreRoutes"));
const visitorRoutes_1 = __importDefault(require("./routes/visitorRoutes"));
app.get('/', (req, res) => {
    res.send('App server is working ...');
});
app.use('/api', routes_1.default);
app.use('/api/sidemenu', sideMenuRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', usersRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/map', mapRoutes_1.default);
app.use('/api/common', commonRoutes_1.default);
app.use('/api/like', likeRoutes_1.default);
app.use('/api/ignore', ignoreRoutes_1.default);
app.use('/api/visitor', visitorRoutes_1.default);
app.all('*', (req, res, next) => {
    next(new AppError_1.default(`Cannot find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler_1.default);
exports.default = app;
