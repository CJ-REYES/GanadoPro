using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using GanadoProBackEnd.Data;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Diagnostics;
using System.Text.Json;
using Microsoft.OpenApi.Models;
using GanadoProBackEnd.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuración Swagger con protección JWT
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "GanadoPro API", Version = "v1" });

    // Define esquema de seguridad JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingresa el token JWT como: Bearer {tu_token}"
    });

    // Aplica el esquema a todos los endpoints
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

// Configurar conexión a base de datos con reintentos
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<MyDbContext>(options =>
{
    options.UseMySql(connectionString, 
        ServerVersion.AutoDetect(connectionString),
        mysqlOptions =>
        {
            mysqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null);
        });
    options.LogTo(Console.WriteLine, LogLevel.Information);
});

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Registrar servicios de actividades
builder.Services.AddScoped<IActividadService, ActividadService>();
builder.Services.AddHttpContextAccessor();

// Configurar autenticación JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
        
        // Opcional: Para depuración
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated successfully");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

builder.Services.AddAuthorization();

// Registrar el servicio en segundo plano
builder.Services.AddHostedService<VentaBackgroundService>();

var app = builder.Build();

// Manejador global de excepciones
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var exceptionHandler = context.Features.Get<IExceptionHandlerFeature>();
        await context.Response.WriteAsync(JsonSerializer.Serialize(new
        {
            error = "Error interno",
            detail = exceptionHandler?.Error.Message
        }));
    });
});

// Activar Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

// ORDEN CORRECTO DE MIDDLEWARES
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();
app.MapControllers();

app.Run();